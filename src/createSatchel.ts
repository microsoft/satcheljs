import { observable, ObservableMap, transaction, action as mobxAction } from 'mobx';
import {
    getPrivateActionId,
    getPrivateActionType,
    setActionType,
    setPrivateActionId,
} from './actionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Middleware from './interfaces/Middleware';
import DispatchFunction from './interfaces/DispatchFunction';
import SubscriberFunction from './interfaces/SubscriberFunction';
import ActionContext from './legacy/ActionContext';
import ActionFunction from './legacy/ActionFunction';
import ActionCreator from './interfaces/ActionCreator';
import { Mutator } from './interfaces/Mutator';
import { Orchestrator } from './interfaces/Orchestrator';

const schemaVersion = 3;

type LegacySatchelProperties = {
    legacyInDispatch: number;
    legacyDispatchWithMiddleware: (
        action: ActionFunction,
        actionType: string,
        args: IArguments,
        actionContext: ActionContext
    ) => Promise<any> | void;
    legacyTestMode: boolean;
};

type SatchelState = {
    schemaVersion: number;
    rootStore: ObservableMap<any>;
    nextActionId: number;
    subscriptions: { [key: string]: SubscriberFunction<ActionMessage, void>[] };
    currentMutator: string | null;
} & LegacySatchelProperties;

export type SatchelInstance = {
    /**
     * Resolves the target of the subscriber and registers it with the dispatcher.
     */
    register: <TAction extends ActionMessage, TReturn = void>(
        subscriber: Mutator<TAction, TReturn> | Orchestrator<TAction>
    ) => SubscriberFunction<TAction, TReturn>;
    dispatch: (actionMessage: ActionMessage) => void;
    createActionCreator: <T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
        actionType: string,
        target: TActionCreator,
        shouldDispatch: boolean
    ) => TActionCreator;
    action: <T extends ActionMessage = {}, TActionCreator extends ActionCreator<T> = () => T>(
        actionType: string,
        target?: TActionCreator
    ) => TActionCreator;
    getRootStore: () => ObservableMap<any>;
    hasSubscribers: (actionCreator: ActionCreator<ActionMessage>) => boolean;
} & LegacySatchelProperties;

export type SatchelOptions = {
    // TODO: Add options here
    middleware?: Array<Middleware>;
};

function getInitialSatchelState(): SatchelState {
    return {
        schemaVersion: schemaVersion,
        rootStore: observable.map({}),
        nextActionId: 0,
        subscriptions: {},
        currentMutator: null,
        legacyInDispatch: 0,
        legacyDispatchWithMiddleware: null,
        legacyTestMode: false,
    };
}

const setPrivateSubscriberRegistered = (target: any, isRegistered: boolean) => {
    target.__SATCHELJS_SUBSCRIBER_REGISTERED = isRegistered;
};

const getPrivateSubscriberRegistered = (target: any): boolean => {
    return target.__SATCHELJS_SUBSCRIBER_REGISTERED;
};

export function createSatchel(options: SatchelOptions = {}): SatchelInstance {
    const { middleware = [] } = options;
    let {
        subscriptions,
        currentMutator,
        nextActionId,
        rootStore,
        legacyTestMode,
        legacyInDispatch,
        legacyDispatchWithMiddleware,
    } = getInitialSatchelState();
    // Private functions
    const finalDispatch = (actionMessage: ActionMessage): void | Promise<void> => {
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

    const dispatchWithMiddleware: DispatchFunction = middleware.reduce(
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

    return {
        register,
        dispatch,
        createActionCreator,
        action,
        getRootStore,
        hasSubscribers,
        // Legacy properties
        legacyInDispatch,
        legacyDispatchWithMiddleware,
        legacyTestMode,
    };
}
