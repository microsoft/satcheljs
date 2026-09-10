import ActionCreator from './ActionCreator';
import type ActionMessage from './ActionMessage';
import type OrchestratorFunction from './OrchestratorFunction';

type Orchestrator<T extends ActionMessage> = {
    type: 'orchestrator';
    actionCreator: ActionCreator<T>;
    target: OrchestratorFunction<T>;
};
export default Orchestrator;
