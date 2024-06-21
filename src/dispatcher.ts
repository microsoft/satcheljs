import { transaction } from 'mobx';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/SubscriberFunction';
import { getPrivateActionId } from './actionCreator';
import { getGlobalContext } from './globalContext';

export function subscribe(actionId: string, callback: Subscriber<any, any>) {
    let subscriptions = getGlobalContext().subscriptions;
    if (!subscriptions[actionId]) {
        subscriptions[actionId] = [];
    }

    subscriptions[actionId].push(callback);
}

export function dispatch(actionMessage: ActionMessage) {
    const currentMutator = getGlobalContext().currentMutator;
    if (currentMutator) {
        throw new Error(
            `Mutator (${currentMutator}) may not dispatch action (${actionMessage.type})`
        );
    }

    let dispatchWithMiddleware = getGlobalContext().dispatchWithMiddleware || finalDispatch;
    transaction(dispatchWithMiddleware.bind(null, actionMessage));
}

export function finalDispatch(actionMessage: ActionMessage): void | Promise<void> {
    let actionId = getPrivateActionId(actionMessage);
    let subscribers = getGlobalContext().subscriptions[actionId];

    if (subscribers) {
        let promises: Promise<any>[] = [];

        for (const subscriber of subscribers) {
            let returnValue = subscriber(actionMessage);
            if (returnValue) {
                promises.push(returnValue);
            }
        }

        if (promises.length) {
            return promises.length == 1 ? promises[0] : Promise.all(promises);
        }
    }
}
