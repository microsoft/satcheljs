# Satchel v3.5

## Goals

Satchel exists because, while we liked the Flux pattern and Redux in particular, there were a few things we wanted that Redux couldn't give us.

* **Strong typing on store and actions.**  There have since emerged a variety of patterns to accomplish this in TypeScript.
* **Avoid immutable semantics.**  The immutable pattern makes for harder to comprehend code and can be more prone to bugs by inexperienced devs.  Today [immer](https://hackernoon.com/introducing-immer-immutability-the-easy-way-9d73d8f71cb3) could solve this for us, but we get it for free with...
* **The power and simplicity of MobX.**  MobX allows components to be reactive with a simple `@observer` decorator and is highly performant by default.  Whatever the front-end of our dataflow looks like, we know we want the store itself to be observable.

Beyond those things, we really like Redux, and much of Satchel is influenced by it.  These goals for v3.5 aim to bring us closer to Redux while keeping the benefits above:

* **Mutators should define the shape of the state tree.**  Currently the store schema is defined separately from mutators, but we want mutators to mirror the shape of the store.  If the store gets it's shape *from* the mutators then this will necessarily be true.
* **State should be passed into the mutators.**  Right now mutators access the the state by importing the store and/or one or more selectors.  By injecting a subtree of the state into the mutator it's clear what the scope of the mutator is.  Plus it will make the mutators easier to test by obviating the need for mocking selectors.
* **Super-strict mode.**  We should provide a new level of strict mode that (for debug builds only, to save on perf) enforces some best practices:
    * State cannot be modified except by the mutator that defines it.
    * References to state cannot be passed as part of an action message.  If necessary, action messages should contain IDs that refer to state rather than the state itself.
* **This should be a non-breaking change.**  A lower priority, but it should be possible to implement this without breaking the existing Satchel APIs.

## API

### `createMutator`

The first challenge with mutators is that—because they act on observable objects—there needs to be a parent object on whose properties to act.  Because reducers return a state object they can literally replace the entire state.  With a little support from Satchel, we can have the best of both worlds: if a mutator returns a value then that value *replaces* the previous state object; if it does not return a value then we *keep* the same state object (which presumably has had some of its properties modified).

Creating a mutator for a simple state would look like the following.  The state is simply a string, and the entire value of the state gets replaced when the mutator runs.

```typescript
const mutator1 = createMutator('initial value')
    .handles(actionA, (state, action) => {
        return 'a';
    })
    .handles(actionB, (state, action) => {
        return 'b';
    });
```

Creating a mutator that mutates an object would look like the following.  Note that nothing is returned, so the reference to the state object itself remains the same.

```typescript
const mutator2 = createMutator({ someProperty: 'some value' })
    .handles(actionA, (state, action) => {
        state.someProperty = 'A';
    })
    .handles(actionB, (state, action) => {
        state.someProperty = 'B';
    });
```

### `combineMutators`

Mutators can be combined to build up the state of the store.  (TypeScript can derive the shape of the combined mutators from the child mutators.)

```typescript
const rootMutator = combineMutators({
    property1: mutator1,
    property2: mutator2
});
```

Effectively this creates a parent node in our state tree, so that our subtree looks like:

```typescript
{
    property1: 'initial value',
    property2: {
        someProperty: 'some value'
    }
}
```

The combined reducer shouldn't expose `handles` because all the handling is done in the child reducers—except for the special case where we want the subtree itself to be null.  We need a few new APIs for that.

```typescript
const rootMutator = combineMutators({
        property1: mutator1,
        property2: mutator2
    })
    .nullOn(actionX)
    .nullOn(actionY)
    .definedOn(actionZ);
```

Satchel will make sure mutators are applied top-down, so that if `actionZ` is dispatched we will *first* define the root object and *then* run the child mutators which may set some properties on it.

### `createStore`

We will have to extend `createStore` to create a store from a mutator.  Functionally this store would be just like any current Satchel store, except that it could only be modified by one of its mutators.

```typescript
const getStore = createStore('store name', rootMutator);
```

## Testing

To test a mutator, you would call `applyAction` on it and pass in some fake state.  (This is the same API that Satchel will use internally to dispatch actions into the mutator.)

```typescript
const returnValue = mutator1.applyAction(fakeAction, fakeState);
```

Faking state is easy—just create a plain object in the shape that the mutator handles.  Because the mutator is targetted to a very small portion of the state tree, the mock data should be trivial.

We also need a way to fake an action.  This is harder since (by design) only Satchel can construct actions.  We'll need to provide some sort of test utils APIs to do this.

```typescript
const fakeAction = createFakeAction(actionA, { someProperty: 'X' });
```

## Code organization

Now that mutators are tightly coupled to the state of the store, it makes sense to locate them with the store, preferably following the shape of the store.  (Because mutators carry the schema there is no need to define the schema separately.)

```
store/
    property1/
        mutator1.ts
    property2/
        mutator2.ts
    rootMutator.ts
    getStore.ts
```
