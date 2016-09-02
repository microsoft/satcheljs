# `applyMiddleware`

`applyMiddleware` specifies one or more middleware that will be called for each action that is dispatched.
For more about what middleware is and how to implement it, see [the section on middleware](../usage/middleware.md).


## Usage

**`applyMiddleware(...middlewares)`**

* `middlewares` are a set of middleware functions.
They will replace any existing middleware and will be called in the order they are provided.
(To remove all middleware, call `applyMiddleware` with no arguments.)


## Example

```typescript
applyMiddleware(middleware0, middleware1, middleware2);
```
