# `getRootStore`

Returns Satchel's root store object.

## Usage

**`getRootStore()`**

### Return value

* *(`ObservableMap<any>`)*: The root store object.

## Example

```typescript
createStore<any>(
    "todoStore",
    {
        todos: [],
        filter: "All"
    });

let rootStore = getRootStore();

console.log(getRootStore().get("todoStore"));
// {
//     todos: [],
//     filter: "All"
// }
```

## Notes

Satchel allows you to create multiple stores via `createStore`.
Internally, all of these stores are stored off of a root store object.
The root store is an ObservableMap where each store is indexed by the `name` provided when creating it.
Typically you should only act on the store objects returned from `createStore`, but `rootStore` is exposed for cases where you might need access to the entire Satchel store at once.
For example, this would allow you to serialize the entire store to JSON.
