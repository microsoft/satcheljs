import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';

let subscriptions: {[key: string]: Subscriber<ActionMessage>[]} = {};

export function subscribe(actionType: string, callback: Subscriber<any>) {
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
