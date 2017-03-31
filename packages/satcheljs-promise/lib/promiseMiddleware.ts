import { DispatchFunction, ActionFunction, ActionContext } from 'satcheljs';

let actionStack: string[] = [];

export function getCurrentAction() {
    return actionStack.length ? actionStack[actionStack.length - 1] : null;
}

export function promiseMiddleware(
    next: DispatchFunction,
    action: ActionFunction,
    actionType: string,
    args: IArguments,
    actionContext: ActionContext)
{
    try
    {
        actionStack.push(actionType);
        return next(action, actionType, args, actionContext);
    }
    finally {
        actionStack.pop();
    }
}
