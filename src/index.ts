import { useStrict } from 'mobx';

// Current API
export { default as ActionCreator } from './interfaces/ActionCreator';
export { default as ActionMessage } from './interfaces/ActionMessage';
export { default as DispatchFunction } from './interfaces/DispatchFunction';
export { default as Middleware } from './interfaces/Middleware';
export { default as Subscriber } from './interfaces/Subscriber';
export { actionCreator, actionCreatorWithoutDispatch } from './actionCreator';
export { default as applyMiddleware } from './applyMiddleware';
export { default as createStore } from './createStore';
export { dispatch } from './dispatcher';
export { default as mutator } from './mutator';
export { default as orchestrator } from './orchestrator';
export { default as getRootStore } from './getRootStore';
export { mutatorAction, orchestratorAction } from './simpleSubscribers';
export { useStrict };

// Default to MobX strict mode
useStrict(true);
