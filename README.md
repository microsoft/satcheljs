# Satchel

Satchel is a dataflow framework based on the [Flux architecture](http://facebook.github.io/react/blog/2014/05/06/flux.html). It is characterized by exposing an observable state that makes view updates painless and efficient.

[![npm](https://img.shields.io/npm/v/satcheljs.svg)](https://www.npmjs.com/package/satcheljs)
[![Build Status](https://travis-ci.org/Microsoft/satcheljs.svg?branch=master)](https://travis-ci.org/Microsoft/satcheljs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Influences

Satchel is an attempt to synthesize the best of several dataflow patterns typically used to drive a React-based UI. In particular:

-   [Flux](http://facebook.github.io/react/blog/2014/05/06/flux.html) is not a library itself, but is a dataflow pattern conceived for use with React. In Flux, dataflow is unidirectional, and the only way to modify state is by dispatching actions through a central dispatcher.
-   [Redux](http://redux.js.org/index.html) is an implementation of Flux that consolidates stores into a single state tree and attempts to simplify state changes by making all mutations via pure functions called reducers. Ultimately, however, we found reducers and immutable state cumbersome to deal with, particularly in a large, interconnected app.
-   [MobX](http://mobxjs.github.io/mobx/index.html) provides a seamless way to make state observable, and allows React to listen to state changes and rerender in a very performant way. Satchel uses MobX under the covers to allow React components to observe the data they depend on.

## Advantages

There are a number of advantages to using Satchel to maintain your application state:

-   Satchel enables a very **performant UI**, only rerendering the minimal amount necessary. MobX makes UI updates very efficient by automatically detecting specifically what components need to rerender for a given state change.
-   Satchel's datastore allows for **isomorphic JavaScript** by making it feasible to render on the server and then serialize and pass the application state down to the client.
-   Satchel supports **middleware** that can act on each action that is dispatched. (For example, for tracing or performance instrumentation.)
-   Satchel is **type-safe** out of the box, without any extra effort on the consumer's part.

## Installation

Install via NPM:

`npm install satcheljs --save`

In order to use Satchel with React, you'll also need MobX and the MobX React bindings:

`npm install mobx --save`

`npm install mobx-react --save`

## Usage

The following examples assume you're developing in Typescript.

### Create a satchel instance

```typescript
import { createSatchel } from 'satcheljs';

export const mySatchel = createSatchel({
    // Optional middleware that runs for every dispatched action
    middleware: [],
});
```

Each satchel instance is completely isolated: it has its own stores, subscribers, and middleware.
Action creators can only be used with the satchel that created them.
In practice an application should only create one satchel.

Creating a satchel enables MobX strict mode, so that only mutators can modify the store.
Call `useStrict(false)` after creating the satchel to opt out.

### Create a store with some initial state

```typescript
import { mySatchel } from './mySatchel';

let getStore = mySatchel.createStore('todoStore', { todos: [] });
```

### Create a component that consumes your state

Notice the `@observer` decorator on the component—this is what tells MobX to rerender the component whenever the data it relies on changes.

```javascript
import { observer } from 'mobx-react';

@observer
class TodoListComponent extends React.Component<any, any> {
    render() {
        return (
            <div>
                {getStore().todos.map(todo => (
                    <div>{todo.text}</div>
                ))}
            </div>
        );
    }
}
```

### Implement an action creator

Note that, as a convenience, Satchel action creators created with the `action` API both _create_ and _dispatch_ the action.
This is typically how you want to use action creators.
If you want to create and dispatch the actions separately you can use the `actionCreator` and `dispatch` APIs.

```typescript
import { mySatchel } from './mySatchel';

let addTodo = mySatchel.action('ADD_TODO', (text: string) => ({ text: text }));

// This creates and dispatches an ADD_TODO action
addTodo('Take out trash');
```

### Implement a mutator

You specify what action a mutator subscribes to by providing the corresponding action creator.
If you're using TypeScript, the type of `actionMessage` is automatically inferred.

```typescript
import { mutator } from 'satcheljs';
import { mySatchel } from './mySatchel';

const todoMutator = mutator(addTodo, (actionMessage) => {
    getStore().todos.push({
        id: Math.random(),
        text: actionMessage.text,
    });
});

// Mutators don't do anything until they're registered with a satchel
export function initializeMutators() {
    mySatchel.register(todoMutator);
}
```

### Orchestrators

Orchestrators are like mutators—they subscribe to actions—but they serve a different purpose.
While mutators modify the store, orchestrators are responsible for side effects.
Side effects might include making a server call or even dispatching further actions.

The following example shows how an orchestrator can persist a value to a server before updating the store.

```typescript
import { orchestrator } from 'satcheljs';
import { mySatchel } from './mySatchel';

let requestAddTodo = mySatchel.action('REQUEST_ADD_TODO', (text: string) => ({ text: text }));

const requestAddTodoOrchestrator = orchestrator(requestAddTodo, async (actionMessage) => {
    await addTodoOnServer(actionMessage.text);
    addTodo(actionMessage.text);
});

export function initializeOrchestrators() {
    mySatchel.register(requestAddTodoOrchestrator);
}
```

### mutatorAction

In many cases a given action only needs to be handled by one mutator.
Satchel provides this utility API which encapsulates action creation, dispatch, and handling in one simple function call.

The `addTodo` mutator above could be implemented as follows:

```typescript
import { mySatchel } from './mySatchel';

let addTodo = mySatchel.mutatorAction('ADD_TODO', function addTodo(text: string) {
    getStore().todos.push({
        id: Math.random(),
        text: text,
    });
});
```

Unlike `mutator`, `mutatorAction` registers the mutator with the satchel immediately.

This is a succinct and easy way to write mutators, but it comes with a restriction:
the action creator is not exposed, so no _other_ mutators or orchestrators can subscribe to it.
If an action needs multiple handlers then it must use the full pattern with action creators and handlers implemented separately.

### Middleware

Middleware is passed to `createSatchel` and is called for every dispatched action, in order.
Each middleware receives the next dispatch function in the pipeline and the action message.

```typescript
import { createSatchel, Middleware } from 'satcheljs';

const logger: Middleware = (next, actionMessage) => {
    console.log('Dispatching', actionMessage.type);
    return next(actionMessage);
};

export const mySatchel = createSatchel({ middleware: [logger] });
```

Use `mySatchel.hasSubscribers(actionCreator)` to check whether any mutators or orchestrators are registered for an action.

## Migrating from v4

-   Create a satchel with `createSatchel` instead of relying on global state. `applyMiddleware` is replaced by the `middleware` option.
-   `action`, `actionCreator`, `dispatch`, `mutatorAction`, `createStore`, and `getRootStore` are now methods on the satchel instance.
-   `mutator` and `orchestrator` no longer register themselves as a side effect; register them with `satchel.register(...)`.
-   The legacy APIs (`satcheljs/lib/legacy`, including `createUndo`, `select`, `stitch`, `trace`, the promise middleware and `reactive`) have been removed.

## License - MIT
