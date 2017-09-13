# `mutator`

Registers a function as a mutator.

## Usage

**`mutator(actionCreator, target)`**

### Arguments

* `actionCreator` *(`ActionCreator`)*: The action creator of the action to subscribe to.
* `target` *(`(ActionMessage) => void`)*: The function to register as a mutator.

### Return value

* *(`(ActionMessage) => void`)*: The `target` function.

## Example

```typescript
let addTodo = actionCreator(
    'ADD_TODO',
    (text: string) => ({ text: text }));

mutator(addTodo, (actionMessage) => {
    getStore().todos.push({
        id: Math.random(),
        text: actionMessage.text
    });
});
```

## Notes

* The `target` function gets called whenever an action of the subscribed type is dispatched.
* Mutators are responsible for modifying the store in response to actions.  They should not dispatch other actions or have any other side effects.
* Note that a mutator is registered to an action by passing that action's *action creator* as the first argument.  This is a little unusual, but convenient because it allows TypeScript to infer the type of the action message.
* For convenience, `mutator` returns `target`.  While you don't need to export a mutator function, it may be convenient to do so for testing purposes.
