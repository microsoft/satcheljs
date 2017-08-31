import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import OrchestratorFunction from './interfaces/OrchestratorFunction';
import { getPrivateActionId } from './actionCreator';
import { subscribe } from './dispatcher';

export default function orchestrator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: OrchestratorFunction<T>
) {
    let actionId = getPrivateActionId(actionCreator);
    if (!actionId) {
        throw new Error('Orchestrators can only subscribe to action creators.');
    }

    subscribe(actionId, target);
    return target;
}
