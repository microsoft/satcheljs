# `createStore`

Application state is contained in one or more Satchel stores.
For a simple application it is possible to keep the entire state in a single store, but you may want to divide state into different domains.
Also, `createStore` allows you to delay initialization of some portion of the store.
This is useful if you want to load and initialize some portion of your application on demand.


## Usage

**`createStore<T>(name, initialValue)`**

* `T` is an interface describing the shape of the store.
* `name` is a unique identifier for the store.
* `initialValue` is the initial state of the store.


## Example

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

## Pitfalls

* MobX can only observe properties that actually exist when an object is made observable.
For this reason, it is important to **initialize all properties**, even if you just initialize them to null.
(It is advised that you avoid optional properties in your store interfaces.
Then the Typescript compiler will give you an error if you forget to initialize anything.)

* For the same reason, if you want to use an object as a dictionary (i.e. to store and lookup values based on arbitrary keys) then you should initialize it as an [ObservableMap](https://mobxjs.github.io/mobx/refguide/map.html).
