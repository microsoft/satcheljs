import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getActionType } from './actionCreator';

let subscriptions: {[key: string]: Subscriber<ActionMessage>[]} = {};

export function subscribe<T extends ActionMessage>(actionCreator: ActionCreator<T>, callback: Subscriber<T>) {
    let actionType = getActionType(actionCreator);
    if (!subscriptions[actionType]) {
        subscriptions[actionType] = [];
    }

    subscriptions[actionType].push(callback);
}

export function dispatch(actionMessage: ActionMessage) {
    let subscribers = subscriptions[actionMessage.type];
    if (subscribers) {
        subscribers.forEach((subscriber) => subscriber(actionMessage));
    }
}
