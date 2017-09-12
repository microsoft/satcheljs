# Mutators and Orchestrators

Satchel is fundamentally about coordinating state changes and side effects across an application in a way that is easy to implement and to reason about.
While there is one overarching pattern, Satchel provides a number of tools and it is important to choose the right one for your scenario.
The following table shows when each API for responding to an action is appropriate.

|                                                                     | You need to modify the application state | You need to make a server call, dispatch further actions, or trigger other side effects |
|---------------------------------------------------------------------|------------------------------------------|---|
| Your action has exactly one subscriber                              | `mutatorAction`                          | `orchestratorAction` |
| Your action may be subscribed to by other mutators or orchestrators | `mutator`                                | `orchestrator` |




> Note: The `mutatorAction` and `orchestratorAction` APIs provide a concise and convenient way to create mutators and orchestrators when there is a 1:1 correspondence between the action and the handler of that action.
> There's no requirement to use them, and it would be fine to build a Satchel app entirely with traditional Flux action creators for every action.

## Mutators

* Mutators should typically be small, scoped to a single store or portion of a store and only concerned with setting or updating data in that store.
* Mutators should maintain the internal consistency of a store.
  For example, if a store contains several tables with related data, the mutators should make sure all applicable tables get updated.
* Mutators should not throw exceptions.
  If necessary, a mutator can set some state in the store to indicate an error.

## Orchestrators

Orchestrators are the Swiss army knife of Satchel.
They may do a variety of things:

* Perform async operations.
  Typically the orchestrator will dispatch an initial action (e.g. to show a loading indicator), perform the async operation, and then dispatch another action (e.g. to store the results and hide the loading indicator).
* Coordinate between different stores.
  A large app will typically have multiple stores that are decoupled from each other, so an orchestrator is where you can coordinate operations that span multiple stores.
  For instance, you might need to perform an operation in one store based on the state of another store.
* Dispatch several actions in a particular order.
  This might be necessary if a series of mutators need to be triggered in a particular sequence.

Before you use an orchestrator to coordinate things, consider whether the orchestrator is really necessary.  Can Satchel's dispatcher provide the coordination for you simply by subscribing two or more independent mutators to the action?
