import ActionFunction from './ActionFunction';
import DispatchFunction from './DispatchFunction';
import Middleware from './Middleware';

let internalDispatchWithMiddleware = finalDispatch;

export default function applyMiddleware(...middleware: Middleware[]) {
    var next: DispatchFunction = finalDispatch;
    for (var i = middleware.length - 1; i >= 0; i--) {
        next = applyMiddlewareInternal(middleware[i], next);
    }

    internalDispatchWithMiddleware = next;
}

function applyMiddlewareInternal(middleware: Middleware, next: DispatchFunction): DispatchFunction {
    return (action, actionType, args, options) => middleware(next, action, actionType, args, options);
}

export function dispatchWithMiddleware(action: ActionFunction, actionType: string, args: IArguments,  middlewareOptions: { [key: string]: any }) {
    internalDispatchWithMiddleware(action, actionType, args, middlewareOptions);
}

function finalDispatch(action: ActionFunction, actionType: string, args: IArguments,  middlewareOptions: { [key: string]: any }) {
    return action();
}
