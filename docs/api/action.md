# `action`

The action decorator turns a function into an action.
An action is anything that modifies the state of the appication.
An action doesn't *have* to modify state (it could have some other side effect such as making a server request) but typically it will also update the UI state in order to indicate to the user that something has happened.

SatchelJS will throw an error if data in its store is modified outside of an action.


## Usage

**`action(name)(fn)`**

* `name` is a string that identifies the action.  Typically it should be the same as the name of the function.
* `fn` is the function to convert to an action.  It can take any parameter as arguments and should return either `void` or a `Promise` (if it does some async work).


## Example

```typescript
let setValue = action("setValue")(
    function setValue(newValue: number) {
        someStore.value = newValue;
    });
```
