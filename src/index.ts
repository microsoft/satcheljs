import useStrict from './useStrict';

// Current API
export { default as ActionCreator } from './interfaces/ActionCreator';
export { default as ActionMessage } from './interfaces/ActionMessage';
export { default as DispatchFunction } from './interfaces/DispatchFunction';
export { default as Middleware } from './interfaces/Middleware';
export { default as MutatorFunction } from './interfaces/MutatorFunction';
export { default as OrchestratorFunction } from './interfaces/OrchestratorFunction';
export { Mutator } from './interfaces/Mutator';
export { Orchestrator } from './interfaces/Orchestrator';
export { default as mutator } from './mutator';
import { default as orchestrator } from './orchestrator';
export { mutatorAction } from './simpleSubscribers';
export { useStrict };

// exporting an alias for orchestrator called "flow"
export const flow = orchestrator;
export { orchestrator };

// Default to MobX strict mode
useStrict(true);
