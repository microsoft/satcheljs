import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getActionType } from './actionDispatcher';

let subscriptions: {[key: string]: Subscriber<ActionMessage>[]} = {};

export function subscribe<T extends ActionMessage>(actionDispatcher: ActionCreator<T>, callback: Subscriber<T>) {
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
