# `dispatch`

Dispatches an action message.

## Usage

**`dispatch(actionMessage)`**

### Arguments

* `actionMessage` *(`ActionMessage`)*: The action message to dispatch.

## Example

```typescript
let addTodo = actionCreator(
    'ADD_TODO',
    (text: string) => ({ text: text }));

dispatch(addTodo('Take out trash'));
```

## Notes

* A dispatched action message goes through each applied middleware, and then any subscribed mutators and orchestrators are called.
* Typically you can just use `boundActionCreator` to create and dispatch action messages without calling `dispatch` directly.
