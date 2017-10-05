import { observable, ObservableMap } from 'mobx';
import ActionMessage from './interfaces/ActionMessage';
import DispatchFunction from './interfaces/DispatchFunction';
import Subscriber from './interfaces/Subscriber';
import ActionContext from './legacy/ActionContext';
import ActionFunction from './legacy/ActionFunction';

const schemaVersion = 3;

// Interfaces for Global Context
export interface GlobalContext {
    schemaVersion: number;
    rootStore: ObservableMap<any>;
    nextActionId: number;
    subscriptions: { [key: string]: Subscriber<ActionMessage>[] };
    dispatchWithMiddleware: DispatchFunction;
    inMutator: boolean;

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

declare var global: {
    __satchelGlobalContext: GlobalContext;
};

// A reset global context function to be used INTERNALLY by SatchelJS tests and for initialization ONLY
export function __resetGlobalContext() {
    global.__satchelGlobalContext = {
        schemaVersion: schemaVersion,
        rootStore: observable.map({}),
        nextActionId: 0,
        subscriptions: {},
        dispatchWithMiddleware: null,
        inMutator: false,
        legacyInDispatch: 0,
        legacyDispatchWithMiddleware: null,
        legacyTestMode: false,
    };
}

export function ensureGlobalContextSchemaVersion() {
    if (schemaVersion != global.__satchelGlobalContext.schemaVersion) {
        throw new Error('Detected incompatible SatchelJS versions loaded.');
    }
}

export function getGlobalContext() {
    return global.__satchelGlobalContext;
}

// Side Effects: actually initialize the global context if it is undefined
if (!global.__satchelGlobalContext) {
    __resetGlobalContext();
} else {
    ensureGlobalContextSchemaVersion();
}
