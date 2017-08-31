# `mutatorAction`

Decorates a function as a mutator action.

## Usage

**`mutatorAction(target)`**

### Arguments

* `target` *(`(...) => void`)*: The function to register as a mutator.

### Return value

* *(`(...) => void`)*: The mutator function.

## Example

```typescript
let addTodo = mutatorAction(
    'ADD_TODO',
    function addTodo(text: string) {
        getStore().todos.push({
            id: Math.random(),
            text: actionMessage.text
        });
    });

addTodo('Take out trash');
```

## Notes

* `mutatorAction` encapsulates action creation, dispatch, and registering the mutator in one simple function call.
* Use `mutatorAction` as a convenience when an action only needs to trigger one specific mutator.
* Because the action creator is not exposed, no other mutators or orchestrators can subscribe to it.  If an action needs multiple handlers then it must use the full pattern with action creators and handlers implemented separately.
