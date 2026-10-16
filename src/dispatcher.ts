import { transaction } from 'mobx';
import assertOwnedBySatchel from './assertOwnedBySatchel';
import type ActionMessage from './interfaces/ActionMessage';
import type DispatchFunction from './interfaces/DispatchFunction';
import type Middleware from './interfaces/Middleware';
import type SatchelState from './interfaces/SatchelState';
import { getPrivateActionId } from './privatePropertyUtils';

export function createDispatchWithMiddleware(
    middleware: Middleware[],
    finalDispatch: DispatchFunction
): DispatchFunction {
    return middleware.reduceRight(
        (next: DispatchFunction, m: Middleware) => m.bind(null, next),
        finalDispatch
    );
}

export function createFinalDispatch(state: SatchelState): DispatchFunction {
    return (actionMessage: ActionMessage) => {
        const subscribers = state.subscriptions.get(getPrivateActionId(actionMessage));

        if (subscribers) {
            const promises: Promise<any>[] = [];

            for (const subscriber of subscribers) {
                const returnValue = subscriber(actionMessage);
                if (returnValue) {
                    promises.push(returnValue);
                }
            }

            if (promises.length) {
                return promises.length == 1 ? promises[0] : Promise.all(promises);
            }
        }
    };
}

export function createDispatch(
    state: SatchelState,
    middleware: Middleware[]
): (actionMessage: ActionMessage) => void {
    const dispatchWithMiddleware = createDispatchWithMiddleware(
        middleware,
        createFinalDispatch(state)
    );

    return (actionMessage: ActionMessage): void => {
        if (state.currentMutator) {
            throw new Error(
                `Mutator (${state.currentMutator}) may not dispatch action (${actionMessage.type})`
            );
        }

        assertOwnedBySatchel(state, actionMessage);

        transaction(() => {
            dispatchWithMiddleware(actionMessage);
        });
    };
}
