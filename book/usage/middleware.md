## Middleware

While actions look and act like simple function calls, they actually go through Satchel's dispatch pipeline.
Middleware allows you to hook into that pipeline in order to be notified of every action that is dispatched, and even modify or intercept the action.


### Creating middleware

Middleware is simply a function with the following signature:

```typescript
function sampleMiddleware(next, action, actionType, args)
```

`next`:
The next step in the dispatch pipeline.
It is a function that takes `action`, `actionType`, and `args` as parameters.
**Every middleware should call `next` at some point** (unless it wants to prevent the action from being executed).

`action`:
A callback that will actually execute the action.  This is a parameterless function.

`actionType`:
The name of the action.

`args`:
The arguments passed to the action.


### Example

The following is a simple middleware that traces each action to the console:

```typescript
function traceMiddleware(next, action, actionType, args) {
    console.log("Dispatching action: " + actionType);
    next(action, actionType, args);
}
```


### Installing middleware

You tell Satchel to use your middleware by calling `applyMiddleware`.
Calling `applyMiddleware` will *replace* any current middleware with the list of middleware you provide.

```typescript
applyMiddleware(traceMiddleware, middleware2, middleware3);
```


### Existing middleware

* [satcheljs-trace](https://github.com/Microsoft/satcheljs-trace) - Tracing middleware to log each action that gets dispatched.
* [satcheljs-stitch](https://github.com/Microsoft/satcheljs-stitch) - Event aggregation middleware that allows you to listen for and respond to specific actions.
* [satcheljs-react-devtools](https://github.com/Microsoft/satcheljs-react-devtools) - Accumulates some useful dev tools for tuning performance in a SatchelJS app.
