# `orchestrator`

Registers a function as an orchestrator.

## Usage

**`orchestrator(actionCreator, target)`**

### Arguments

* `actionCreator` *(`ActionCreator`)*: The action creator of the action to subscribe to.
* `target` *(`(ActionMessage) => void`)*: The function to register as an orchestrator.

## Example

```typescript
let addTodo = actionCreator(
    'ADD_TODO',
    (text: string) => ({ text: text }));

orchestrator(addTodo, (actionMessage) => {
    addTodoOnServer(actionMessage.text);
};
```

## Notes

* The `target` function gets called whenever an action of the subscribed type is dispatched.
* Orchestrators are responsible for dealing with side effects and any other coordination the app may require.  Side effects might include service calls, setting timers, dealing with browser local storage, etc.
* Orchestrators cannot modify the store directly, but they can dispatch further actions which, indirectly, will cause the store to get modified.
* In a large app with many stores, orchestrators provide a way to coordinate between the different stores.  For example, in response to an action an orchestrator might dispatch a series of additional actions in a specific order, or it might read data from one store and conditionally dispatch actions to affect another store.
* Note that an orchestrator is registered to an action by passing that action's *action creator* as the first argument.  This is a little unusual, but convenient because it allows TypeScript to infer the type of the action message.
