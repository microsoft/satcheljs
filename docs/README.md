[![Build Status](https://travis-ci.org/Microsoft/satcheljs.svg?branch=master)](https://travis-ci.org/Microsoft/satcheljs)

# Satchel

Satchel is a data store based on the [Flux architecture](http://facebook.github.io/react/blog/2014/05/06/flux.html).  It is characterized by exposing an observable state that makes view updates painless and efficient.


## Influences

Satchel is an attempt to synthesize the best of several dataflow patterns typically used to drive a React-based UI.  In particular:
* [Flux](http://facebook.github.io/react/blog/2014/05/06/flux.html) is not a library itself, but is a dataflow pattern conceived for use with React.  In Flux, dataflow is unidirectional, and the only way to modify state is by dispatching actions through a central dispatcher.
* [Redux](http://redux.js.org/index.html) is an implementation of Flux that consolidates stores into a single state tree and attempts to simplify state changes by making all mutations via pure functions called reducers.  Ultimately, however, we found that reducers and immutable state were difficult to reason about, particularly in a large, interconnected app.
* [MobX](http://mobxjs.github.io/mobx/index.html) provides a seamless way to make state observable, and allows React to listen to state changes and rerender in a very performant way.  Satchel uses MobX under the covers to allow React components to observe the data they depend on.


## Advantages

There are a number of advantages to using Satchel to maintain your application state.  (Each of the frameworks above has some, but not all, of these qualities.)

* Satchel enables a very **performant UI**, only rerendering the minimal amount necessary.  MobX makes UI updates very efficient by automatically detecting specifically what components need to rerender for a given state change.
* Satchel's datastore allows for **isomorphic JavaScript** by making it feasible to render on the server and then serialize and pass the application state down to the client.
* Satchel supports **middleware** that can act on each action that is dispatched.  (For example, for tracing or performance instrumentation.)
* Satchel requires **minimal boilerplate** code.

## License - MIT