import { useStrict } from 'mobx';

// Current API
export { default as ActionCreator } from './interfaces/ActionCreator';
export { default as ActionMessage } from './interfaces/ActionMessage';
export { default as DispatchFunction } from './interfaces/DispatchFunction';
export { default as Middleware } from './interfaces/Middleware';
export { default as MutatorFunction } from './interfaces/MutatorFunction';
export { default as OrchestratorFunction } from './interfaces/OrchestratorFunction';
export { action, actionCreator } from './actionCreator';
export { default as applyMiddleware } from './applyMiddleware';
export { default as createStore } from './createStore';
export { dispatch } from './dispatcher';
export { default as mutator } from './mutator';
import { default as orchestrator } from './orchestrator';
export { default as getRootStore } from './getRootStore';
export { mutatorAction, orchestratorAction } from './simpleSubscribers';
export { useStrict };

// exporting an alias for orchestrator called "flow"
export const flow = orchestrator;

// Default to MobX strict mode
useStrict(true);
