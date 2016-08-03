
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
	function updateFoo(newFoo: number) {
		myStore.foo = newFoo;
	};

updateFoo = action("updateFoo")(updateFoo);
```

Note that the above is just syntactic sugar for applying an @action decorator.  Typescript doesn't support decorators on function expressions yet, but it will in 2.0.  At that point the syntax for creating an action will be simply:
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
(Again, this syntax will be simplified once Typescript 2.0 is available.)

```typescript
let updateFooAsync =
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

updateFooAsync = action("updateFooAsync")(updateFooAsync);
```
