## Middleware

While actions look and act like simple function calls, they actually go through Satchel's dispatch pipeline.
Middleware allows you to hook into that pipeline in order to be notified of every action that is dispatched, and even modify or intercept the action.

A middleware is simply a function with the following signature:

TODO: Add signature and explanation of parameters...
TODO: Add an example middleware (simple trace to console)...

The following is a simple middleware that traces each action to the console:

```typescript
function traceMiddleware(...) {
    //TODO: fill in parameters and implementation
}

// TODO: apply middleware
```

TODO: List of existing middleware with descriptions and links
