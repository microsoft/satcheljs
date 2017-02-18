[![Build Status](https://travis-ci.org/Microsoft/satcheljs.svg?branch=master)](https://travis-ci.org/Microsoft/satcheljs)

# Satchel

Satchel is a data store based on the [Flux architecture](http://facebook.github.io/react/blog/2014/05/06/flux.html).  It is characterized by exposing an observable state that makes view updates painless and efficient.


## Influences

Satchel is an attempt to synthesize the best of several dataflow patterns typically used to drive a React-based UI.  In particular:
* [Flux](http://facebook.github.io/react/blog/2014/05/06/flux.html) is not a library itself, but is a dataflow pattern conceived for use with React.  In Flux, dataflow is unidirectional, and the only way to modify state is by dispatching actions through a central dispatcher.
* [Redux](http://redux.js.org/index.html) is an implementation of Flux that consolidates stores into a single state tree and attempts to simplify state changes by making all mutations via pure functions called reducers.  Ultimately, however, we found that reducers and immutable state were difficult to reason about, particularly in a large, interconnected app.
* [MobX](http://mobxjs.github.io/mobx/index.html) provides a seamless way to make state observable, and allows React to listen to state changes and rerender in a very performant way.  Satchel uses MobX under the covers to allow React components to observe the data they depend on.


## Advantages

There are a number of advantages to using Satchel to maintain your application state.  (Each of the frameworks above has some, but not all, of these qualities.)

* Satchel enables a very **performant UI**, only rerendering the minimal amount necessary.  MobX makes UI updates very efficient by automatically detecting specifically what components need to rerender for a given state change.
* Satchel's datastore allows for **isomorphic JavaScript** by making it feasible to render on the server and then serialize and pass the application state down to the client.
* Satchel supports **middleware** that can act on each action that is dispatched.  (For example, for tracing or performance instrumentation.)
* Satchel requires **minimal boilerplate** code.


## Installation
Install via NPM:

`npm install satcheljs --save`

In order to use Satchel with React, you'll also need MobX and the MobX React bindings:

`npm install mobx --save`

`npm install mobx-react --save`


## Usage
The following examples assume you're developing in Typescript.

### Create a store with some initial state
```typescript
interface MyStoreSchema {
    foo: number;
    bar: string;
}

var myStore = createStore<MyStoreSchema>(
    "mystore",
    {
        foo: 1,
        bar: "baz"
    });
```

### Create a component that consumes your state
Notice the @observer decorator on the component---this is what tells MobX to rerender the component if any of the data it relies on changes.

```typescript
@observer
class ApplicationComponent extends React.Component<any, any> {
	render() {
		return (<div>foo is {myStore.foo}</div>);
	}
}
```

### Implement an action to update the store

```typescript
let updateFoo =
	@action("updateFoo")
	function updateFoo(newFoo: number) {
		myStore.foo = newFoo;
	};
```

### Call the action

It's just a function:

```typescript
updateFoo(2);
```

### Asynchronous actions

Often actions will need to do some sort of asynchronous work (such as making a server request) and then update the state based on the result.
Since the asynchronous callback happens outside of the context of the original action the callback itself must be an action too.

```typescript
let updateFooAsync =
	@action("updateFooAsync")
	function updateFooAsync(newFoo: number) {
		// You can modify the state in the original action
		myStore.loading = true;

		// doSomethingAsync returns a promise
		doSomethingAsync().then(
			action("doSomethingAsyncCallback")(
				() => {
					// Modify the state again in the callback
					myStore.loading = false;
					myStore.foo = newFoo;
				}));
	};
```

## License - MIT
