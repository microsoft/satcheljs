import useStrict from './useStrict';

// Current API
export { default as ActionCreator } from './interfaces/ActionCreator';
export { default as ActionMessage } from './interfaces/ActionMessage';
export { default as DispatchFunction } from './interfaces/DispatchFunction';
export { default as Middleware } from './interfaces/Middleware';
export { default as MutatorFunction } from './interfaces/MutatorFunction';
export { default as OrchestratorFunction } from './interfaces/OrchestratorFunction';
export { action, actionCreator } from './actionCreator';
export { default as applyMiddleware } from './applyMiddleware';
export { default as createMutator } from './createMutator';
export { default as combineMutators } from './combineMutators';
export { default as createStore } from './createStore';
export { dispatch } from './dispatcher';
export { default as mutator } from './mutatorDecorator';
export { default as LeafMutator } from './LeafMutator';
import { default as orchestrator } from './orchestratorDecorator';
export { default as getRootStore } from './getRootStore';
export { mutatorAction, orchestratorAction } from './simpleSubscribers';
export { useStrict };

// exporting an alias for orchestrator called "flow"
export const flow = orchestrator;
export { orchestrator };

// Default to MobX strict mode
useStrict(true);
