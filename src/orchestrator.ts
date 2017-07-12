import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getPrivateActionId } from './actionCreator';
import { subscribe } from './dispatcher';

export function orchestrator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: Subscriber<T>
) {
    let actionId = getPrivateActionId(actionCreator);
    if (!actionId) {
        throw new Error('Orchestrators can only subscribe to action creators.');
    }

    subscribe(actionId, target);
    return target;
}
