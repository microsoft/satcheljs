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

var store = createStore(
    'scoreboardStore',
    {
        score: 0
    });
```

### Create a component that consumes your state

Notice the `@observer` decorator on the component—this is what tells MobX to rerender the component whenever the data it relies on changes.

```javascript
@observer
class ApplicationComponent extends React.Component<any, any> {
    render() {
        return (<div>Score = {store.score}</div>);
    }
}
```

### Implement an action creator

```typescript
import { actionCreator } from 'satcheljs';

let addPoints = actionCreator('ADD_POINTS',
    (points: number) => ({
        points: points
    }));
```

### Implement a mutator

You specify what action a mutator subscribes to by providing the corresponding action creator.
If you're using TypeScript, the type of `actionMessage` is automatically inferred.

```typescript
import { mutator } from 'satcheljs';

mutator(addPoints, (actionMessage) => {
    store.score += actionMessage.points;
};
```

### Create and dispatch an action

```typescript
import { dispatch } from 'satcheljs';

dispatch(addPoints(2));
```

### Bound action creators

Bound action creators create and dispatch the action in one call.
Also notice that if the action doesn't need any arguments then you don't need to supply an action creator function.

```typescript
import { boundActionCreator } from 'satcheljs';

let resetScore = boundActionCreator('RESET_SCORE');

// This dispatches a RESET_SCORE action.  Of course, you'd still need a mutator
// to subscribe to it to update the store.
resetScore();
```

### Orchestrators

Orchestrators are like mutators—they subscribe to actions—but they serve a different purpose.
While mutators modify the store, orchestrators are responsible for side effects.
Side effects might include making a server call or even dispatching further actions.

The following example shows how an orchestrator can persist a value to a server before updating the store.

```typescript
import { boundActionCreator, orchestrator } from 'satcheljs';

let requestAddPoints = boundActionCreator('REQUEST_ADD_POINTS',
    (points: number) => ({
    }));

orchestrator(requestAddPoints, (actionMessage) => {
    updatePointsOnServer(store.score + actionMessage.points)
    .then((response) => {
        if (response.result == 200) {
            addPoints(actionMessage.points);
        }
    });
};
```

### Simple mutators and orchestrators

In many cases a given action only needs to be handled by one mutator.
Satchel provides the concept of a simple mutator which ecapsulates action creation, dispatch, and handling in one simple function call.
The `addPoints` mutator above could be implemented as follows:

```typescript
let addPoints = simpleMutator(
    'addPoints',
    function addPoints(points: number) {
        store.score += points;
    });
```

Simple orchestrators can be created similarly:

```typescript
let requestAddPoints = simpleOrchestrator(
    'requestAddPoints',
    function requestAddPoints(points: number) {
        .then((response) => {
            if (response.result == 200) {
                addPoints(points);
            }
        });
    });
```

These simple mutators and orchestrators are succinct and easy to write, but they come with a restriction:
the action creator is not exposed, so no other mutators or orchestrators can subscribe to it.
If an action needs multiple handlers then it must use the full pattern with action creators and handlers implemented separately.

## License - MIT
