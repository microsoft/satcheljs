import { DispatchFunction, ActionFunction, ActionContext } from 'satcheljs';

export default function promiseMiddleware(next: DispatchFunction, action: ActionFunction, actionType: string, args: IArguments, actionContext: ActionContext) {
    return next(action, actionType, args, actionContext);
}
