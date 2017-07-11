import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getGlobalContext } from './globalContext';

let subscriptions: { [key: string]: Subscriber<ActionMessage>[] } = {};

export function subscribe(actionType: string, callback: Subscriber<any>) {
    if (!subscriptions[actionType]) {
        subscriptions[actionType] = [];
    }

    subscriptions[actionType].push(callback);
}

export function dispatch(actionMessage: ActionMessage) {
    let dispatchWithMiddleware = getGlobalContext().dispatchWithMiddleware || finalDispatch;
    dispatchWithMiddleware(actionMessage);
}

export function finalDispatch(actionMessage: ActionMessage) {
    let subscribers = subscriptions[actionMessage.type];
    if (subscribers) {
        subscribers.forEach(subscriber => subscriber(actionMessage));
    }
}
