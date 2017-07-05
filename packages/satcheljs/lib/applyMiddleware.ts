import ActionMessage from './interfaces/ActionMessage';
import DispatchFunction from './interfaces/DispatchFunction';
import Middleware from './interfaces/Middleware';
import { finalDispatch } from './dispatcher';
import { getGlobalContext } from './globalContext';

export default function applyMiddleware(...middleware: Middleware[]) {
    var next: DispatchFunction = finalDispatch;
    for (var i = middleware.length - 1; i >= 0; i--) {
        next = applyNextMiddleware(middleware[i], next);
    }

    getGlobalContext().dispatchWithMiddleware = next;
}

function applyNextMiddleware(middleware: Middleware, next: DispatchFunction): DispatchFunction {
    return (actionMessage) => middleware(next, actionMessage);
}
