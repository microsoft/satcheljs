import { map, ObservableMap } from 'mobx';
import ActionContext from './ActionContext';
import ActionFunction from './ActionFunction';

// Interfaces for Global Context
export interface GlobalContext {
    inDispatch: number;
    rootStore: ObservableMap<any>;
    dispatchWithMiddleware: (action: ActionFunction, actionType: string, args: IArguments, actionContext: ActionContext) => Promise<any> | void
}

declare var global: {
    __satchelGlobalContext: GlobalContext;
};

// A reset global state function to be used INTERNALLY by SatchelJS tests
export function __resetGlobalState() {
    global.__satchelGlobalContext = {
        inDispatch: 0,
        rootStore: map({}),
        dispatchWithMiddleware: null
    };
}

// Side Effects: actually initialize the global context if it is undefined
if (!global.__satchelGlobalContext) {
    __resetGlobalState();
}

export default global.__satchelGlobalContext;
