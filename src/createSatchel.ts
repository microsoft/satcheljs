import { observable, ObservableMap, transaction, action as mobxAction } from 'mobx';
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
import { Orchestrator } from './interfaces/Orchestrator';

type SatchelState = {
    rootStore: ObservableMap<any>;
    nextActionId: number;
    subscriptions: { [key: string]: SubscriberFunction<ActionMessage, void>[] };
    currentMutator: string | null;
};

export type SatchelInstance = {
    /**
     * Resolves the target of the subscriber and registers it with the dispatcher.
     */
    register: <TAction extends ActionMessage, TReturn = void>(
        subscriber: Mutator<TAction, TReturn> | Orchestrator<TAction>
    ) => SubscriberFunction<TAction, TReturn>;
    dispatch: (actionMessage: ActionMessage) => void;
    actionCreator: <
        T extends ActionMessage = {},
        TActionCreator extends ActionCreator<T> = () => T
    >(
        actionType: string,
        target?: TActionCreator
    ) => TActionCreator;
    action: <T extends ActionMessage = {}, TActionCreator extends ActionCreator<T> = () => T>(
        actionType: string,
        target?: TActionCreator
    ) => TActionCreator;
    createStore: <T>(key: string, initialState: T) => () => T;
    getRootStore: () => ObservableMap<any>;
    hasSubscribers: (actionCreator: ActionCreator<ActionMessage>) => boolean;
};

export type PrivateSatchelFunctions = {
    __createActionId: () => string;
    __dispatchWithMiddleware: DispatchFunction;
    __finalDispatch: DispatchFunction;
    __subscriptions: { [key: string]: SubscriberFunction<ActionMessage, void>[] };
    __currentMutator: string | null;
};

export type SatchelOptions = {
    middleware?: Array<Middleware>;
};

function getInitialSatchelState(): SatchelState {
    return {
        rootStore: observable.map({}),
        nextActionId: 0,
        subscriptions: {},
        currentMutator: null,
    };
}

export function createSatchel(options: SatchelOptions = {}): SatchelInstance {
    const { middleware = [] } = options;
    let { subscriptions, currentMutator, nextActionId, rootStore } = getInitialSatchelState();
    const finalDispatch: DispatchFunction = (
        actionMessage: ActionMessage
    ): void | Promise<void> => {
        let actionId = getPrivateActionId(actionMessage);
        let subscribers = subscriptions[actionId];

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
    };

    const dispatchWithMiddleware: DispatchFunction = middleware.reduceRight(
        (next: DispatchFunction, m: Middleware) => m.bind(null, next),
        finalDispatch
    );

    const createActionId = (): string => {
        return (nextActionId++).toString();
    };

    const wrapMutatorTarget = <TAction extends ActionMessage, TReturn>({
        actionCreator,
        target,
    }: Mutator<TAction, TReturn>) => {
        // Wrap the callback in a MobX action so it can modify the store
        const actionType = getPrivateActionType(actionCreator);
        return mobxAction(actionType, (actionMessage: TAction) => {
            try {
                currentMutator = actionType;
                target(actionMessage);
                currentMutator = null;
            } catch (e) {
                currentMutator = null;
                throw e;
            }
        });
    };

    // Public functions
    const register = <TAction extends ActionMessage, TReturn = void>(
        subscriber: Mutator<TAction, TReturn> | Orchestrator<TAction>
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
            subscriber.type == 'mutator' ? wrapMutatorTarget(subscriber) : subscriber.target;

        if (!subscriptions[actionId]) {
            subscriptions[actionId] = [];
        }

        subscriptions[actionId].push(wrappedTarget);
        // Mark the subscriber as registered
        setPrivateSubscriberRegistered(subscriber, true);

        return subscriber.target;
    };

    const dispatch = (actionMessage: ActionMessage): void => {
        if (currentMutator) {
            throw new Error(
                `Mutator (${currentMutator}) may not dispatch action (${actionMessage.type})`
            );
        }

        transaction(dispatchWithMiddleware.bind(null, actionMessage));
    };

    const createActionCreator = <T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
        actionType: string,
        target: TActionCreator,
        shouldDispatch: boolean
    ): TActionCreator => {
        let actionId = createActionId();

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
                dispatch(actionMessage);
            }

            return actionMessage;
        } as TActionCreator;

        // Stamp the action creator function with the private ID
        setPrivateActionId(decoratedTarget, actionId);
        setActionType(decoratedTarget, actionType);
        return decoratedTarget;
    };

    const actionCreator = <
        T extends ActionMessage = {},
        TActionCreator extends ActionCreator<T> = () => T
    >(
        actionType: string,
        target?: TActionCreator
    ): TActionCreator => {
        return createActionCreator(actionType, target, false);
    };

    const action = <
        T extends ActionMessage = {},
        TActionCreator extends ActionCreator<T> = () => T
    >(
        actionType: string,
        target?: TActionCreator
    ): TActionCreator => {
        return createActionCreator(actionType, target, true);
    };

    const getRootStore = (): ObservableMap<any> => {
        return rootStore;
    };

    const hasSubscribers = (actionCreator: ActionCreator<ActionMessage>) => {
        return !!subscriptions[getPrivateActionId(actionCreator)];
    };

    const createStoreAction = mobxAction('createStore', function createStoreAction(
        key: string,
        initialState: any
    ) {
        if (getRootStore().get(key)) {
            throw new Error(`A store named ${key} has already been created.`);
        }

        getRootStore().set(key, initialState);
    });

    const createStore = <T>(key: string, initialState: T): (() => T) => {
        createStoreAction(key, initialState);
        return () => <T>getRootStore().get(key);
    };

    const satchelInstance: SatchelInstance & PrivateSatchelFunctions = {
        register,
        dispatch,
        actionCreator,
        action,
        getRootStore,
        hasSubscribers,
        createStore,
        // Private functions used only for testing
        __createActionId: createActionId,
        __dispatchWithMiddleware: dispatchWithMiddleware,
        __finalDispatch: finalDispatch,
        __subscriptions: subscriptions,
        __currentMutator: currentMutator,
    };

    return satchelInstance;
}
