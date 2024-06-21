import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import OrchestratorFunction from './interfaces/OrchestratorFunction';
import { Orchestrator } from './interfaces/Orchestrator';

export default function orchestrator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: OrchestratorFunction<T>
): Orchestrator<T> {
    return {
        type: 'orchestrator',
        actionCreator,
        target,
    };
}
