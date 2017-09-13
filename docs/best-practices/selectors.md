# Selectors

Selectors are functions that retrieve and possibly transform data from the store. Because of the benefits of using selectors, even the `createStore()` API returns a selector of the store itself.
A simple selector might look like the following:

```typescript
import getStore from './store';

export function getFullName() {
    const store = getStore();
    return store.firstName + ' ' + store.lastName;
}
```

## Why use selectors?

* **Selectors reduce duplication** of common utility code for accessing the store.

* **Selectors are easy to mock** in tests because they are simple functions (e.g. with something like Jasmine's `spyOn` API).
  This is much simpler than mocking the store object itself.

* Factoring store access into selectors allows you to **unit test data retrieval independently of data consumption**.

* **Selectors are highly composable** since they're just simple functions.

* Perhaps the biggest benefit selectors provide is the **flexibility to allow the store to model the fundemantal state of the app**.
  In the above example, the fundamental state includes `firstName` and `lastName`.
  It would be possible to also store a `fullName` property, but that would be redundant because it is made up of the other two.
  Selectors allow you to derive the data you need on demand when rendering your UI.

## Tips and Tricks

* **Think of selectors as a public interface on top of the private store.**
  Selectors should be called from views, mutators, orchestrators, or even other higher-level selectors.
  Note that the `createStore` API doesn't actually return the store itself, it returns a `getStore` selector.

* **Don't worry about recomputing the value of a selector over and over.**
  Typically the perf cost of this is negligible.
  However, if it's necessary to optimize this you can consider wrapping your selector in a MobX `computed`.

* **Selectors can take parameters.**
  For example:
  ```typescript
  function getFullName(id: string) {
      const person = getStore().people.get(id);
      return person.firstName + ' ' + person.lastName;
  }
  ```
  **Pro-tip: avoid passing an entire subtree of the store into a selector.**
