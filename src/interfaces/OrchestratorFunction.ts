import type ActionMessage from './ActionMessage';

type OrchestratorFunction<T extends ActionMessage> = (actionMessage: T) => void | Promise<any>;
export default OrchestratorFunction;
