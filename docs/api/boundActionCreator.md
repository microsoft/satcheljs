# `boundActionCreator`

Decorates a function as a bound action creator.
A bound action creator automatically dispatches an action message after creating it.

## Usage

**`boundActionCreator<T>(actionType, [target])`**

### Arguments

* `T` *(type parameter)*: An interface describing the shape of the action message to create.
* `actionType` *(`string`)*: A string which identifies the type of the action.
* `target` *(`(...) => T`)*: Optional. A function which creates and returns an action message.

### Return value

* *(`(...) => T`)*: An action creator.

## Example

```typescript
let addTodo = boundActionCreator(
    'ADD_TODO',
    (text: string) => ({ text: text }));

// This creates AND dispatches the ADD_TODO action message
addTodo('Take out trash');
```

## Notes

* Typically the type of the action message (`T`) is inferred from the return type of `target`, so it is not necessary to explicitly supply it.
* Do not include the `type` property on the created action message.  It will automatically be set by the action creator.
* If the `target` is absent the action creator will create an action message with no properties (except the `type` property).
