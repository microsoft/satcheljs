import ActionCreator from './ActionCreator';
import ActionMessage from './ActionMessage';
import OrchestratorFunction from './OrchestratorFunction';

export type Orchestrator<T extends ActionMessage> = {
    type: 'orchestrator';
    actionCreator: ActionCreator<T>;
    target: OrchestratorFunction<T>;
};
