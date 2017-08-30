# Satchel

Satchel is a dataflow framework based on the [Flux architecture](http://facebook.github.io/react/blog/2014/05/06/flux.html).  It is characterized by exposing an observable state that makes view updates painless and efficient.

[![Build Status](https://travis-ci.org/Microsoft/satcheljs.svg?branch=master)](https://travis-ci.org/Microsoft/satcheljs)

## Influences

Satchel is an attempt to synthesize the best of several dataflow patterns typically used to drive a React-based UI.  In particular:

* [Flux](http://facebook.github.io/react/blog/2014/05/06/flux.html) is not a library itself, but is a dataflow pattern conceived for use with React.  In Flux, dataflow is unidirectional, and the only way to modify state is by dispatching actions through a central dispatcher.
* [Redux](http://redux.js.org/index.html) is an implementation of Flux that consolidates stores into a single state tree and attempts to simplify state changes by making all mutations via pure functions called reducers.  Ultimately, however, we found reducers and immutable state cumbersome to deal with, particularly in a large, interconnected app.
* [MobX](http://mobxjs.github.io/mobx/index.html) provides a seamless way to make state observable, and allows React to listen to state changes and rerender in a very performant way.  Satchel uses MobX under the covers to allow React components to observe the data they depend on.

## Advantages

There are a number of advantages to using Satchel to maintain your application state:

* Satchel enables a very **performant UI**, only rerendering the minimal amount necessary.  MobX makes UI updates very efficient by automatically detecting specifically what components need to rerender for a given state change.
* Satchel's datastore allows for **isomorphic JavaScript** by making it feasible to render on the server and then serialize and pass the application state down to the client.
* Satchel supports **middleware** that can act on each action that is dispatched.  (For example, for tracing or performance instrumentation.)
* Satchel is **type-safe** out of the box, without any extra effort on the consumer's part.

## Installation

Install via NPM:

`npm install satcheljs --save`

In order to use Satchel with React, you'll also need MobX and the MobX React bindings:

`npm install mobx --save`

`npm install mobx-react --save`

## Usage

The following examples assume you're developing in Typescript.

### Create a store with some initial state

```typescript
import { createStore } from 'satcheljs';

let getStore = createStore(
    'todoStore',
    { todos: [] }
);
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
                getStore().todos.map(todo => <div>{todo.text}</div>)
            </div>
        );
    }
}
```

### Implement an action creator

Note that, as a convenience, Satchel action creators created with the `action` API both *create* and *dispatch* the action.
This is typically how you want to use action creators.
If you want to create and dispatch the actions separately you can use the `actionCreator` and `dispatch` APIs.

```typescript
import { action } from 'satcheljs';

let addTodo = action(
    'ADD_TODO',
    (text: string) => ({ text: text })
);

// This creates and dispatches an ADD_TODO action
addTodo('Take out trash');
```

### Implement a mutator

You specify what action a mutator subscribes to by providing the corresponding action creator.
If you're using TypeScript, the type of `actionMessage` is automatically inferred.

```typescript
import { mutator } from 'satcheljs';

mutator(addTodo, (actionMessage) => {
    getStore().todos.push({
        id: Math.random(),
        text: actionMessage.text
    });
};
```

### Orchestrators

Orchestrators are like mutators—they subscribe to actions—but they serve a different purpose.
While mutators modify the store, orchestrators are responsible for side effects.
Side effects might include making a server call or even dispatching further actions.

The following example shows how an orchestrator can persist a value to a server before updating the store.

```typescript
import { action, orchestrator } from 'satcheljs';

let requestAddTodo = action(
    'REQUEST_ADD_TODO',
    (text: string) => ({ text: text })
);

orchestrator(requestAddTodo, async (actionMessage) => {
    await addTodoOnServer(actionMessage.text);
    addTodo(actionMessage.text);
};
```

### mutatorAction and orchestratorAction

In many cases a given action only needs to be handled by one mutator or orchestrator.
Satchel provides these utility APIs which encapsulate action creation, dispatch, and handling in one simple function call.

The `addTodo` mutator above could be implemented as follows:

```typescript
let addTodo = mutatorAction(
    'ADD_TODO',
    function addTodo(text: string) {
        getStore().todos.push({
            id: Math.random(),
            text: actionMessage.text
        });
    });
```

An orchestrator can be created similarly:

```typescript
let requestAddTodo = orchestratorAction(
    'REQUEST_ADD_TODO',
    async function requestAddTodo(text: string) {
        await addTodoOnServer(actionMessage.text);
        addTodo(actionMessage.text);
    });
```

This is a succinct and easy way to write mutators and orchestrators, but it comes with a restriction:
the action creator is not exposed, so no *other* mutators or orchestrators can subscribe to it.
If an action needs multiple handlers then it must use the full pattern with action creators and handlers implemented separately.

## License - MIT
