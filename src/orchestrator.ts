import type ActionCreator from './interfaces/ActionCreator';
import type ActionMessage from './interfaces/ActionMessage';
import type OrchestratorFunction from './interfaces/OrchestratorFunction';
import type Orchestrator from './interfaces/Orchestrator';

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
