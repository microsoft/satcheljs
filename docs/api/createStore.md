# `createStore`

Creates a Satchel store and returns a selector to it.

## Usage

**`createStore<T>(name, initialState)`**

### Arguments

* `T` *(type parameter)*: An interface describing the shape of the store.
* `name` *(`string`)*: A unique identifier for the store.
* `initialState` *(`T`)*: The initial state of the store.

### Return value

* *(`() => T`)*: A selector to the created store.

## Example

```typescript
interface TodoStore {
    todos: string[],
    filter: string
}

const getStore = createStore<TodoStore>(
    "todoStore",
    {
        todos: [
            "Take out trash",
            "Pick up milk"
        ],
        filter: "All"
    });

console.log(getStore().todos);
// [ "Take out trash", "Pick up milk" ]
```

## Notes

Application state is contained in one or more Satchel stores.
For a simple application it is possible to keep the entire state in a single store, but you may want to divide state into different domains.
Also, `createStore` allows you to delay initialization of some portion of the store.
This is useful if you want to load and initialize some portion of your application on demand.
