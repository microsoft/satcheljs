
## Installation
Install via NPM:

`npm install satcheljs --save`

In order to use Satchel with React, you'll also need MobX and the MobX React bindings:

`npm install mobx --save`

`npm install mobx-react --save`


## Create a store with some initial state
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

## Create a component that consumes your state
Notice the @observer decorator on the component---this is what tells MobX to rerender the component if any of the data it relies on changes.

```typescript
@observer
class ApplicationComponent extends React.Component<any, any> {
	render() {
		return (<div>foo is {myStore.foo}</div>);
	}
}
```

## Implement an action to update the store

```typescript
let updateFoo =
	function updateFoo(newFoo: number) {
		myStore.foo = newFoo;
	};

updateFoo = action("updateFoo")(updateFoo);
```

Note that the above is just syntactic sugar for applying an @action decorator.  Typescript doesn't support decorators on function expressions yet, but it will [in the future](https://github.com/Microsoft/TypeScript/wiki/Roadmap).  At that point the syntax for creating an action will be simply:
```typescript
let updateFoo =
	@action("updateFoo")
	function updateFoo(newFoo: number) {
		myStore.foo = newFoo;
	};
```

## Call the action

It's just a function:

```typescript
updateFoo(2);
```
