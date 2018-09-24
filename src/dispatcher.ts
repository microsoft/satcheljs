import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getPrivateActionId } from './actionCreator';
import { getGlobalContext } from './globalContext';

export function subscribe(actionId: string, callback: Subscriber<ActionMessage>) {
    let subscriptions = getGlobalContext().subscriptions;
    if (!subscriptions[actionId]) {
        subscriptions[actionId] = [];
    }

    subscriptions[actionId].push(callback);
}

export function subscribeAll(callback: Subscriber<ActionMessage>) {
    getGlobalContext().subscriptionsToAll.push(callback);
}

export function dispatch(actionMessage: ActionMessage) {
    if (getGlobalContext().inMutator) {
        throw new Error('Mutators cannot dispatch further actions.');
    }

    let dispatchWithMiddleware = getGlobalContext().dispatchWithMiddleware || finalDispatch;
    dispatchWithMiddleware(actionMessage);
}

export function finalDispatch(actionMessage: ActionMessage): void | Promise<void> {
    let actionId = getPrivateActionId(actionMessage);
    let promises: Promise<any>[] = [];

    // Callback subscribers to specific actions
    let subscribers = getGlobalContext().subscriptions[actionId];
    if (subscribers) {
        subscribers.forEach(subscriber => {
            let returnValue = subscriber(actionMessage);
            if (returnValue) {
                promises.push(returnValue);
            }
        });
    }

    // Callback subscribers to all actions
    getGlobalContext().subscriptionsToAll.forEach(subscriber => {
        // These subscribers must be mutators, which cannot be async
        subscriber(actionMessage);
    });

    // If multiple promises are returned, merge them
    if (promises.length) {
        return promises.length == 1 ? promises[0] : Promise.all(promises);
    }
}
