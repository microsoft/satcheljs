import { useStrict } from 'mobx';

// Current API
export { default as ActionCreator } from './interfaces/ActionCreator';
export { default as ActionMessage } from './interfaces/ActionMessage';
export { default as DispatchFunction } from './interfaces/DispatchFunction';
export { default as Middleware } from './interfaces/Middleware';
export { default as Subscriber } from './interfaces/Subscriber';
export { actionCreator, boundActionCreator } from './actionCreator';
export { default as applyMiddleware } from './applyMiddleware';
export { default as createStore } from './createStore';
export { dispatch } from './dispatcher';
export { default as initializeState } from './initializeState';
export { mutator } from './mutator';
export { orchestrator } from './orchestrator';
export { default as getRootStore } from './getRootStore';
export { simpleMutator, simpleOrchestrator } from './simpleSubscribers';
export { useStrict };

// Legacy API
export { default as legacyApplyMiddleware } from './legacy/legacyApplyMiddleware';
export { default as LegacyMiddleware } from './legacy/LegacyMiddleware';
export { default as ActionFunction } from './legacy/ActionFunction';
export { default as ActionContext } from './legacy/ActionContext';
export { default as LegacyDispatchFunction } from './legacy/LegacyDispatchFunction';
export { default as action } from './legacy/action';
export { default as select, SelectorFunction } from './legacy/select';
export { default as createUndo, UndoResult, CreateUndoReturnValue } from './legacy/createUndo';
export { getActionType } from './legacy/functionInternals';
export { initializeTestMode, resetTestMode } from './legacy/testMode';

// Default to MobX strict mode
useStrict(true);
