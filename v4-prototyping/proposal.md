# Satchel v3.5

## Goals

Satchel exists because, while we liked the Flux pattern and Redux in particular, there were a few things we wanted that Redux couldn't give us.

* **Strong typing on store and actions.**  There have since emerged a variety of patterns to accomplish this in TypeScript.
* **Avoid immutable semantics.**  The immutable pattern makes for harder to comprehend code and can be more prone to bugs by inexperienced devs.  Today [immer](https://hackernoon.com/introducing-immer-immutability-the-easy-way-9d73d8f71cb3) could solve this for us, but we get it for free with...
* **The power and simplicity of MobX.**  MobX allows components to be reactive with a simple `@observer` decorator and is highly performant by default.  Whatever the front-end of our dataflow looks like, we know we want the store itself to be observable.

Beyond those things, we really like Redux, and much of Satchel is influenced by it.  These goals for v3.5 aim to bring us closer to Redux while keeping the benefits above:

* **Mutators should define the shape of the state tree.**  Currently the store schema is defined separately from mutators, but we want mutators to mirror the shape of the store.  If the store gets it's shape *from* the mutators then this will necessarily be true.
* **State should be passed into the mutators.**  Right now mutators access the the state by importing the store and/or one or more selectors.  By injecting a subtree of the state into the mutator it's clear what the scope of the mutator is.  Plus it will make the mutators easier to test by obviating the need for mocking selectors.
* **Super-strict mode.**  We should provide a new level of strict mode that (for debug builds only, to save on perf) enforces some best practices:
    * State cannot be modified except by the mutator that defines it.
    * References to state cannot be passed as part of an action message.  If necessary, action messages should contain IDs that refer to state rather than the state itself.
* **This should be a non-breaking change.**  A lower priority, but it should be possible to implement this without breaking the existing Satchel APIs.
