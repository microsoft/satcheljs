import ActionContext from './ActionContext';
import ActionFunction from './ActionFunction';
import LegacyDispatchFunction from './LegacyDispatchFunction';
import LegacyMiddleware from './LegacyMiddleware';
import { getGlobalContext } from '../globalContext';

export default function applyMiddleware(...middleware: LegacyMiddleware[]) {
    var next: LegacyDispatchFunction = finalDispatch;
    for (var i = middleware.length - 1; i >= 0; i--) {
        next = applyMiddlewareInternal(middleware[i], next);
    }

    getGlobalContext().legacyDispatchWithMiddleware = next;
}

function applyMiddlewareInternal(
    middleware: LegacyMiddleware,
    next: LegacyDispatchFunction
): LegacyDispatchFunction {
    return middleware.bind(null, next);
}

export function dispatchWithMiddleware(
    action: ActionFunction,
    actionType: string,
    args: IArguments,
    actionContext: ActionContext
) {
    if (!getGlobalContext().legacyDispatchWithMiddleware) {
        getGlobalContext().legacyDispatchWithMiddleware = finalDispatch;
    }

    getGlobalContext().legacyDispatchWithMiddleware(action, actionType, args, actionContext);
}

function finalDispatch(
    action: ActionFunction,
    actionType: string,
    args: IArguments,
    actionContext: ActionContext
) {
    return action();
}
