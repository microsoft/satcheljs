import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Mutator from './interfaces/Mutator';
import { getActionType } from './actionDispatcher';

let subscriptions: {[key: string]: Mutator[]} = {};

export function subscribe(actionDispatcher: ActionCreator, callback: Mutator) {
    let actionType = getActionType(actionDispatcher);
    if (!subscriptions[actionType]) {
        subscriptions[actionType] = [];
    }

    subscriptions[actionType].push(callback);
}

export function notifySubscribers(actionMessage: ActionMessage) {

}
