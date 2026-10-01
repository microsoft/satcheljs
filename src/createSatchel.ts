import { observable, ObservableMap, transaction, action as mobxAction } from 'mobx';
import {
    getPrivateActionId,
    getPrivateActionType,
    getPrivateSatchelOwner,
    setPrivateActionId,
    setPrivateActionType,
    setPrivateSatchelOwner,
} from './privatePropertyUtils';
import type ActionMessage from './interfaces/ActionMessage';
import type Middleware from './interfaces/Middleware';
import type DispatchFunction from './interfaces/DispatchFunction';
import type SubscriberFunction from './interfaces/SubscriberFunction';
import type ActionCreator from './interfaces/ActionCreator';
import type Mutator from './interfaces/Mutator';
import type Subscriber from './interfaces/Subscriber';
import type SatchelOptions from './interfaces/SatchelOptions';
import type SatchelInternal from './interfaces/SatchelInternal';
import type SatchelState from './interfaces/SatchelState';
import type Satchel from './interfaces/Satchel';
import type MutatorActionTarget from './interfaces/MutatorActionTarget';
import mutator from './mutator';
import useStrict from './useStrict';

type ActionMessageWithArgs<T extends any[]> = ActionMessage & { args: T };

export function createDispatchWithMiddleware(
    middleware: Middleware[],
    finalDispatch: DispatchFunction
) {
    return middleware.reduceRight(
        (next: DispatchFunction, m: Middleware) => m.bind(null, next),
        finalDispatch
    );
}

export function createSatchelInternal(options: SatchelOptions = {}): SatchelInternal {
    const { middleware = [] } = options;

    // Default to MobX strict mode so that only mutators can modify the store
    useStrict(true);

    const satchel: SatchelInternal = {
        // State
        __subscriptions: {},
        __nextActionId: 0,
        __rootStore: observable.map({}),
        __currentMutator: null,
        __ownerToken: {},
        __registeredSubscribers: new WeakMap(),
        // Public functions
        register: <TAction extends ActionMessage, TReturn = void>(
            subscriber: Subscriber<TAction, TReturn>
        ): SubscriberFunction<TAction, TReturn> => {
            if (satchel.__registeredSubscribers.has(subscriber)) {
                // If the subscriber is already registered with this satchel, no-op.
                return subscriber.target;
            }

            const actionId = getPrivateActionId(subscriber.actionCreator);
            if (!actionId) {
                throw new Error(`A ${subscriber.type} can only subscribe to action creators.`);
            }

            satchel.__assertOwnedBySatchel(subscriber.actionCreator);

            const wrappedTarget =
                subscriber.type == 'mutator'
                    ? satchel.__wrapMutatorTarget(subscriber)
                    : subscriber.target;

            if (!satchel.__subscriptions[actionId]) {
                satchel.__subscriptions[actionId] = [];
            }

            satchel.__subscriptions[actionId].push(wrappedTarget);
            satchel.__registeredSubscribers.set(subscriber, true);

            return subscriber.target;
        },
        dispatch: (actionMessage: ActionMessage): void => {
            if (satchel.__currentMutator) {
                throw new Error(
                    `Mutator (${satchel.__currentMutator}) may not dispatch action (${actionMessage.type})`
                );
            }

            satchel.__assertOwnedBySatchel(actionMessage);

            transaction(satchel.__dispatchWithMiddleware.bind(null, actionMessage));
        },
        actionCreator: <
            T extends ActionMessage = {},
            TActionCreator extends ActionCreator<T> = () => T,
        >(
            actionType: string,
            target?: TActionCreator
        ): TActionCreator => {
            return satchel.__createActionCreator(actionType, target, false);
        },
        action: <T extends ActionMessage = {}, TActionCreator extends ActionCreator<T> = () => T>(
            actionType: string,
            target?: TActionCreator
        ): TActionCreator => {
            return satchel.__createActionCreator(actionType, target, true);
        },
        mutatorAction: <TFunction extends ActionCreator<any>>(
            actionType: string,
            target: MutatorActionTarget<TFunction>
        ) => {
            const simpleActionCreator = satchel.action(
                actionType,
                (...args: Parameters<TFunction>) => {
                    return {
                        args,
                    };
                }
            );

            const mutatorTarget = (
                actionMessage: ActionMessageWithArgs<Parameters<TFunction>>
            ): void => {
                return target(...actionMessage.args);
            };

            const simpleMutator = mutator(simpleActionCreator, mutatorTarget);

            satchel.register(simpleMutator);

            return simpleActionCreator;
        },
        getRootStore: (): ObservableMap<any> => {
            return satchel.__rootStore;
        },
        hasSubscribers: (actionCreator: ActionCreator<ActionMessage>) => {
            const owner = getPrivateSatchelOwner(actionCreator);
            if (owner && owner !== satchel.__ownerToken) {
                return false;
            }

            return !!satchel.__subscriptions[getPrivateActionId(actionCreator)];
        },
        createStore: <T>(key: string, initialState: T): (() => T) => {
            satchel.__createStoreAction(key, initialState);
            return () => <T>satchel.getRootStore().get(key);
        },
        getSubscriptions: () => {
            // Return a copy so consumers can't mutate the internal subscriptions
            const subscriptions: SatchelState['__subscriptions'] = {};
            for (const actionId of Object.keys(satchel.__subscriptions)) {
                subscriptions[actionId] = satchel.__subscriptions[actionId].slice();
            }
            return subscriptions;
        },
        getCurrentMutator: () => {
            return satchel.__currentMutator;
        },
        // Private functions
        __assertOwnedBySatchel: (target: ActionCreator<ActionMessage> | ActionMessage) => {
            // Objects without an owner (e.g. plain action messages or test mocks) are allowed
            const owner = getPrivateSatchelOwner(target);
            if (owner && owner !== satchel.__ownerToken) {
                const actionType = (target as ActionMessage).type || getPrivateActionType(target);
                throw new Error(
                    `Action (${actionType}) was created by a different satchel instance.`
                );
            }
        },
        __createActionId: (): string => {
            return (satchel.__nextActionId++).toString();
        },
        __finalDispatch: (actionMessage) => {
            let actionId = getPrivateActionId(actionMessage);
            let subscribers = satchel.__subscriptions[actionId];

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
        },
        __wrapMutatorTarget: <TAction extends ActionMessage, TReturn>({
            actionCreator,
            target,
        }: Mutator<TAction, TReturn>) => {
            // Wrap the callback in a MobX action so it can modify the store
            const actionType = getPrivateActionType(actionCreator);
            return mobxAction(actionType, (actionMessage: TAction) => {
                try {
                    satchel.__currentMutator = actionType;
                    target(actionMessage);
                    satchel.__currentMutator = null;
                } catch (e) {
                    satchel.__currentMutator = null;
                    throw e;
                }
            });
        },
        __createStoreAction: mobxAction(
            'createStore',
            function createStoreAction(key: string, initialState: any) {
                if (satchel.getRootStore().get(key)) {
                    throw new Error(`A store named ${key} has already been created.`);
                }

                satchel.getRootStore().set(key, initialState);
            }
        ),
        __createActionCreator: <T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
            actionType: string,
            target: TActionCreator,
            shouldDispatch: boolean
        ): TActionCreator => {
            let actionId = satchel.__createActionId();

            let decoratedTarget = function createAction(...args: any[]) {
                // Create the action message
                let actionMessage: ActionMessage = target ? target.apply(null, args) : {};

                // Stamp the action type
                if (actionMessage.type) {
                    throw new Error('Action creators should not include the type property.');
                }

                // Stamp the action message with the type and the private ID
                actionMessage.type = actionType;
                setPrivateActionId(actionMessage, actionId);
                setPrivateSatchelOwner(actionMessage, satchel.__ownerToken);

                // Dispatch if necessary
                if (shouldDispatch) {
                    satchel.dispatch(actionMessage);
                }

                return actionMessage;
            } as TActionCreator;

            // Stamp the action creator function with the private ID
            setPrivateActionId(decoratedTarget, actionId);
            setPrivateActionType(decoratedTarget, actionType);
            setPrivateSatchelOwner(decoratedTarget, satchel.__ownerToken);
            return decoratedTarget;
        },
        // This gets initialized below since we need __finalDispatch to be defined
        __dispatchWithMiddleware: undefined as DispatchFunction,
    };

    satchel.__dispatchWithMiddleware = createDispatchWithMiddleware(
        middleware,
        satchel.__finalDispatch
    );

    return satchel;
}

/**
 * Creates a new, isolated satchel instance.
 * @param options {SatchelOptions} Options such as the middleware to apply to dispatched actions.
 * @returns {Satchel} The satchel instance.
 */
export function createSatchel(options?: SatchelOptions): Satchel {
    const satchel = createSatchelInternal(options);

    // Only expose the public API so the internal state can't be accessed or modified
    return {
        register: satchel.register,
        dispatch: satchel.dispatch,
        actionCreator: satchel.actionCreator,
        action: satchel.action,
        mutatorAction: satchel.mutatorAction,
        createStore: satchel.createStore,
        getRootStore: satchel.getRootStore,
        hasSubscribers: satchel.hasSubscribers,
        getCurrentMutator: satchel.getCurrentMutator,
        getSubscriptions: satchel.getSubscriptions,
    };
}
