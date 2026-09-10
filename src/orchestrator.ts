import type ActionCreator from './interfaces/ActionCreator';
import type ActionMessage from './interfaces/ActionMessage';
import type OrchestratorFunction from './interfaces/OrchestratorFunction';
import type Orchestrator from './interfaces/Orchestrator';
import { setPrivateSubscriberRegistered } from './privatePropertyUtils';

export default function orchestrator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: OrchestratorFunction<T>
): Orchestrator<T> {
    const orchestrator: Orchestrator<T> = {
        type: 'orchestrator',
        actionCreator,
        target,
    };

    setPrivateSubscriberRegistered(orchestrator, false);

    return orchestrator;
}
