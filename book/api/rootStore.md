# `rootStore`

An [ObservableMap](https://mobxjs.github.io/mobx/refguide/map.html) which is Satchel's root store object.


Satchel allows you to create multiple stores via `createStore`.
Internally, all of these stores are stored on a root store object.
The root store is an ObservableMap where each store is indexed by the `name` provided when creating it.
Typically you should only act on the store objects returned from `createStore`, but `rootStore` is exposed for cases where you might need access to the entire Satchel store at once.
For example, you could serialize `rootStore` to JSON and later restore it via `initializeStore`.
