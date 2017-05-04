import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Mutator from './interfaces/Mutator';
import { getActionType } from './actionDispatcher';

let subscriptions: {[key: string]: Mutator<ActionMessage>[]} = {};

export function subscribe<T extends ActionMessage>(actionDispatcher: ActionCreator<T>, callback: Mutator<T>) {
    let actionType = getActionType(actionDispatcher);
    if (!subscriptions[actionType]) {
        subscriptions[actionType] = [];
    }

    subscriptions[actionType].push(callback);
}

export function notifySubscribers(actionMessage: ActionMessage) {
    let subscribers = subscriptions[actionMessage.type];
    if (subscribers) {
        subscribers.forEach((subscriber) => subscriber(actionMessage));
    }
}
