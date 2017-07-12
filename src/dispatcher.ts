import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getPrivateActionId } from './actionCreator';
import { getGlobalContext } from './globalContext';

export function subscribe(actionId: string, callback: Subscriber<any>) {
    let subscriptions = getGlobalContext().subscriptions;
    if (!subscriptions[actionId]) {
        subscriptions[actionId] = [];
    }

    subscriptions[actionId].push(callback);
}

export function dispatch(actionMessage: ActionMessage) {
    let dispatchWithMiddleware = getGlobalContext().dispatchWithMiddleware || finalDispatch;
    dispatchWithMiddleware(actionMessage);
}

export function finalDispatch(actionMessage: ActionMessage) {
    let actionId = getPrivateActionId(actionMessage);
    let subscribers = getGlobalContext().subscriptions[actionId];
    if (subscribers) {
        subscribers.forEach(subscriber => subscriber(actionMessage));
    }
}
