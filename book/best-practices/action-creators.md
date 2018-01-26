# Action Creators

Action creators are conceptually pretty simple, but there are a few best practices that are good to keep in mind for them.

* **Action messages should contain simple types.**

  In particular, they should not contain references to store objects.

  Think of an action message as just that, a *message*.
  An action message may instruct a mutator to act on a particular object, but it should not contain the object itself.
  Rather, it should contain an ID for the object so that the mutator can lookup the object for itself.
  While passing store objects in an action message will generally work, it can be problematic.
  Store objects are mutable, meaning that the contents of the message may get modified over the course of handling it.

* **Action creators can be used to decouple disparate parts of an app.**

  For example, say you want Component A and Component B to be decoupled from each other.
  However, Component A needs to be able to trigger some mutator in Component B.

  Using an action creator solves this problem:
  Component A calls the action creator to dispatch an action;
  Component B subscribes to the action.
  Now the components can interact indirectly without either one depending on the other.

  ![Decoupling components via an action creator](decoupled-components.png)

* **If only one mutator subscribes to an action creator, consider using a `mutatorAction`.**

  For simple cases this convenience API can cut down on a lot of boilerplate code.
