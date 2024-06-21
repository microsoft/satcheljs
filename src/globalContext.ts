import { observable, ObservableMap } from 'mobx';
import ActionMessage from './interfaces/ActionMessage';
import DispatchFunction from './interfaces/DispatchFunction';
import Subscriber from './interfaces/SubscriberFunction';
import ActionContext from './legacy/ActionContext';
import ActionFunction from './legacy/ActionFunction';

const schemaVersion = 3;

const globalObject = ((typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
    ? window
    : global) as unknown) as {
    __satchelGlobalContext: GlobalContext;
};

// Interfaces for Global Context
export interface GlobalContext {
    schemaVersion: number;
    rootStore: ObservableMap<any>;
    nextActionId: number;
    subscriptions: { [key: string]: Subscriber<ActionMessage, void>[] };
    dispatchWithMiddleware: DispatchFunction;
    currentMutator: string | null;

    // Legacy properties
    legacyInDispatch: number;
    legacyDispatchWithMiddleware: (
        action: ActionFunction,
        actionType: string,
        args: IArguments,
        actionContext: ActionContext
    ) => Promise<any> | void;
    legacyTestMode: boolean;
}

// A reset global context function to be used INTERNALLY by SatchelJS tests and for initialization ONLY
export function __resetGlobalContext() {
    globalObject.__satchelGlobalContext = {
        schemaVersion: schemaVersion,
        rootStore: observable.map({}),
        nextActionId: 0,
        subscriptions: {},
        dispatchWithMiddleware: null,
        currentMutator: null,
        legacyInDispatch: 0,
        legacyDispatchWithMiddleware: null,
        legacyTestMode: false,
    };
}

export function ensureGlobalContextSchemaVersion() {
    if (schemaVersion != globalObject.__satchelGlobalContext.schemaVersion) {
        throw new Error('Detected incompatible SatchelJS versions loaded.');
    }
}

export function getGlobalContext() {
    return globalObject.__satchelGlobalContext;
}

// Side Effects: actually initialize the global context if it is undefined
if (!globalObject.__satchelGlobalContext) {
    __resetGlobalContext();
} else {
    ensureGlobalContextSchemaVersion();
}
