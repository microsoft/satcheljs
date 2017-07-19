# `simpleOrchestrator`

Decorates a function as a simple orchestrator.

## Usage

**`simpleOrchestrator(target)`**

### Arguments

* `target` *(`(...) => void`)*: The function to register as an orchestrator.

### Return value

* *(`(...) => void`)*: The simple orchestrator function.

## Example

```typescript
let addTodo = simpleOrchestrator(
    'ADD_TODO',
    function addTodo(text: string) {
        addTodoOnServer(actionMessage.text);
    });

addTodo('Take out trash');
```

## Notes

* `simpleOrchestrator` encapsulates action creation, dispatch, and registering the orchestrator in one simple function call.
* Use `simpleOrchestrator` as a convenience when an action only needs to trigger one specific orchestrator.
* Because the action creator is not exposed, no other mutators or orchestrators can subscribe to it.  If an action needs multiple handlers then it must use the full pattern with action creators and handlers implemented separately.
