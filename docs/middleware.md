## Middleware

Middleware allows you to hook into the dispatch pipeline in order to be notified of every action that is dispatched, and even modify or intercept the action.


### Creating middleware

Middleware is simply a function with the following signature:

```typescript
function sampleMiddleware(next, actionMessage)
```

`next`:
The next step in the dispatch pipeline.
It is a function that takes `actionMessage` as a parameter.
**Every middleware should call `next` at some point** (unless it wants to prevent the action from being dispatched further).

`actionMessage`:
The action message object.

### Example

The following is a simple middleware that traces each action to the console:

```typescript
import { ActionMessage, DispatchFunction } from 'satcheljs';

function traceMiddleware(next: DispatchFunction, actionMessage: ActionMessage) {
    console.log("Dispatching action: " + actionMessage.type);
    next(actionMessage);
}
```

### Installing middleware

You tell Satchel to use your middleware by calling `applyMiddleware`.
Calling `applyMiddleware` will *replace* any current middleware with the list of middleware you provide.

```typescript
import { applyMiddleware } from 'satcheljs';

applyMiddleware(traceMiddleware, middleware2, middleware3);
```
