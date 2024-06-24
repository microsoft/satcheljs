import { observable, ObservableMap, transaction, action as mobxAction, IAction } from 'mobx';
import {
    getPrivateActionId,
    getPrivateActionType,
    setActionType,
    setPrivateActionId,
    getPrivateSubscriberRegistered,
    setPrivateSubscriberRegistered,
} from './privatePropertyUtils';
import ActionMessage from './interfaces/ActionMessage';
import Middleware from './interfaces/Middleware';
import DispatchFunction from './interfaces/DispatchFunction';
import SubscriberFunction from './interfaces/SubscriberFunction';
import ActionCreator from './interfaces/ActionCreator';
import { Mutator } from './interfaces/Mutator';
import { Subscriber } from './interfaces/Subscriber';

type SatchelState = {
    __rootStore: ObservableMap<any>;
    __nextActionId: number;
    __subscriptions: { [key: string]: SubscriberFunction<ActionMessage, void>[] };
    __currentMutator: string | null;
};

export type SatchelInstance = {
    /**
     * Resolves the target of the subscriber and registers it with the dispatcher.
     */
    register: <TAction extends ActionMessage, TReturn = void>(
        subscriber: Subscriber<TAction, TReturn>
    ) => SubscriberFunction<TAction, TReturn>;
    /**
     * Dispatches the action message
     * @param actionMessage {ActionMessage} The action message to dispatch
     * @returns {void}
     */
    dispatch: (actionMessage: ActionMessage) => void;
    /**
     * Decorates a function as an action creator.
     * @template T (type parameter) An interface describing the shape of the action message to create.
     * @param actionType {string}:A string which identifies the type of the action.
     * @param target {((...) => T)=} A function which creates and returns an action message
     * @returns {ActionCreator<T>} An action creator
     */
    actionCreator: <
        T extends ActionMessage = {},
        TActionCreator extends ActionCreator<T> = () => T
    >(
        actionType: string,
        target?: TActionCreator
    ) => TActionCreator;
    /**
     * Decorates a function as an action creator which also dispatches the action message after creating it.
     *
     * @template T (type parameter) An interface describing the shape of the action message to create.
     * @param actionType {string}:A string which identifies the type of the action.
     * @param target {((...) => T)=} A function which creates and returns an action message
     * @returns {ActionCreator<T>} An action creator
     */
    action: <T extends ActionMessage = {}, TActionCreator extends ActionCreator<T> = () => T>(
        actionType: string,
        target?: TActionCreator
    ) => TActionCreator;
    /**
     * Creates a Satchel store and returns a selector to it.
     *
     * @template T (type parameter) An interface describing the shape of the store.
     * @param name {string} A unique identifier for the store.
     * @param initialState {T} The initial state of the store.
     * @returns {() => T} A selector to the store.
     */
    createStore: <T>(key: string, initialState: T) => () => T;
    /**
     * Returns Satchel's root store object of the satchel instance.
     * @returns {ObservableMap<any>} The root store object
     */
    getRootStore: () => ObservableMap<any>;
    /**
     * Returns whether the action creator has any subscribers.
     * @returns {boolean} True if the action creator has subscribers, false otherwise.
     */
    hasSubscribers: (actionCreator: ActionCreator<ActionMessage>) => boolean;
};

export type SatchelPrivateInstanceFunctions = {
    __createActionId: () => string;
    __dispatchWithMiddleware: DispatchFunction;
    __finalDispatch: DispatchFunction;
    __createStoreAction: (key: string, initialState: any) => void;
    __createActionCreator: <T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
        actionType: string,
        target: TActionCreator,
        shouldDispatch: boolean
    ) => TActionCreator;
    __wrapMutatorTarget: <TAction extends ActionMessage, TReturn>(
        mutator: Mutator<TAction, TReturn>
    ) => ((actionMessage: TAction) => void) & IAction;
};

export type SatchelInternalInstance = SatchelInstance &
    SatchelPrivateInstanceFunctions &
    SatchelState;

export type SatchelOptions = {
    middleware?: Array<Middleware>;
};

export function createSatchelInternal(
    options: SatchelOptions = {},
    // This is only used for testing purposes
    finalDispatch?: DispatchFunction
): SatchelInternalInstance {
    const { middleware = [] } = options;

    const satchel: SatchelInternalInstance = {
        // State
        __subscriptions: {},
        __nextActionId: 0,
        __rootStore: observable.map({}),
        __currentMutator: null,
        // Public functions
        register: <TAction extends ActionMessage, TReturn = void>(
            subscriber: Subscriber<TAction, TReturn>
        ): SubscriberFunction<TAction, TReturn> => {
            if (getPrivateSubscriberRegistered(subscriber)) {
                // If the subscriber is already registered, no-op.
                return subscriber.target;
            }

            const actionId = getPrivateActionId(subscriber.actionCreator);
            if (!actionId) {
                throw new Error(`A ${subscriber.type} can only subscribe to action creators.`);
            }

            const wrappedTarget =
                subscriber.type == 'mutator'
                    ? satchel.__wrapMutatorTarget(subscriber)
                    : subscriber.target;

            if (!satchel.__subscriptions[actionId]) {
                satchel.__subscriptions[actionId] = [];
            }

            satchel.__subscriptions[actionId].push(wrappedTarget);
            // Mark the subscriber as registered
            setPrivateSubscriberRegistered(subscriber, true);

            return subscriber.target;
        },
        dispatch: (actionMessage: ActionMessage): void => {
            if (satchel.__currentMutator) {
                throw new Error(
                    `Mutator (${satchel.__currentMutator}) may not dispatch action (${actionMessage.type})`
                );
            }

            transaction(satchel.__dispatchWithMiddleware.bind(null, actionMessage));
        },
        actionCreator: <
            T extends ActionMessage = {},
            TActionCreator extends ActionCreator<T> = () => T
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
        getRootStore: (): ObservableMap<any> => {
            return satchel.__rootStore;
        },
        hasSubscribers: (actionCreator: ActionCreator<ActionMessage>) => {
            return !!satchel.__subscriptions[getPrivateActionId(actionCreator)];
        },
        createStore: <T>(key: string, initialState: T): (() => T) => {
            satchel.__createStoreAction(key, initialState);
            return () => <T>satchel.getRootStore().get(key);
        },
        // Private functions
        __createActionId: (): string => {
            return (satchel.__nextActionId++).toString();
        },
        __finalDispatch:
            finalDispatch ??
            ((actionMessage: ActionMessage): void | Promise<void> => {
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
            }),
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
        __createStoreAction: mobxAction('createStore', function createStoreAction(
            key: string,
            initialState: any
        ) {
            if (satchel.getRootStore().get(key)) {
                throw new Error(`A store named ${key} has already been created.`);
            }

            satchel.getRootStore().set(key, initialState);
        }),
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

                // Dispatch if necessary
                if (shouldDispatch) {
                    satchel.dispatch(actionMessage);
                }

                return actionMessage;
            } as TActionCreator;

            // Stamp the action creator function with the private ID
            setPrivateActionId(decoratedTarget, actionId);
            setActionType(decoratedTarget, actionType);
            return decoratedTarget;
        },
        // This gets initialized below since we need __finalDispatch to be defined
        __dispatchWithMiddleware: undefined as DispatchFunction,
    };

    satchel.__dispatchWithMiddleware = middleware.reduceRight(
        (next: DispatchFunction, m: Middleware) => m.bind(null, next),
        satchel.__finalDispatch
    );

    return satchel;
}

// Exclude the private functions from the public API
export const createSatchel: (options?: SatchelOptions) => SatchelInstance = createSatchelInternal;
