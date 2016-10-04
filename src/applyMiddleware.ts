import ActionContext from './ActionContext';
import ActionFunction from './ActionFunction';
import DispatchFunction from './DispatchFunction';
import Middleware from './Middleware';
import globalContext from './globalContext';

export default function applyMiddleware(...middleware: Middleware[]) {
    var next: DispatchFunction = finalDispatch;
    for (var i = middleware.length - 1; i >= 0; i--) {
        next = applyMiddlewareInternal(middleware[i], next);
    }

    globalContext.dispatchWithMiddleware = next;
}

function applyMiddlewareInternal(middleware: Middleware, next: DispatchFunction): DispatchFunction {
    return (action, actionType, args, actionContext) => middleware(next, action, actionType, args, actionContext);
}

export function dispatchWithMiddleware(action: ActionFunction, actionType: string, args: IArguments,  actionContext: ActionContext) {
    if (!globalContext.dispatchWithMiddleware) {
        globalContext.dispatchWithMiddleware = finalDispatch;
    }

    globalContext.dispatchWithMiddleware(action, actionType, args, actionContext);
}

function finalDispatch(action: ActionFunction, actionType: string, args: IArguments,  actionContext: ActionContext) {
    return action();
}
