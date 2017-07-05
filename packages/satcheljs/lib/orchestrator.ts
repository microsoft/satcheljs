import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getActionType } from './actionCreator';
import { subscribe } from './dispatcher';

export function orchestrator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: Subscriber<T>)
{
    let actionType = getActionType(actionCreator);
    if (!actionType) {
        throw new Error("Orchestrators can only subscribe to action creators.");
    }

    subscribe(actionType, target);
    return target;
}
