import { map, ObservableMap } from 'mobx';
import ActionContext from './ActionContext';
import ActionFunction from './ActionFunction';

const schemaVersion = 2;

// Interfaces for Global Context
export interface GlobalContext {
    schemaVersion: number;
    inDispatch: number;
    rootStore: ObservableMap<any>;
    dispatchWithMiddleware: (action: ActionFunction, actionType: string, args: IArguments, actionContext: ActionContext) => Promise<any> | void;
    testMode: boolean;
}

declare var global: {
    __satchelGlobalContext: GlobalContext;
};

// A reset global context function to be used INTERNALLY by SatchelJS tests and for initialization ONLY
export function __resetGlobalContext() {
    global.__satchelGlobalContext = {
        schemaVersion: schemaVersion,
        inDispatch: 0,
        rootStore: map({}),
        dispatchWithMiddleware: null,
        testMode: false
    };
}

export function ensureGlobalContextSchemaVersion() {
    if (schemaVersion != global.__satchelGlobalContext.schemaVersion) {
        throw new Error("Detected incompatible SatchelJS versions loaded.");
    }
}

export function getGlobalContext() {
    return global.__satchelGlobalContext;
};

// Side Effects: actually initialize the global context if it is undefined
if (!global.__satchelGlobalContext) {
    __resetGlobalContext();
} else {
    ensureGlobalContextSchemaVersion();
}