import { action, ActionFunction, DispatchFunction, ActionContext } from 'satcheljs';

export interface ActionHandler {
    (...args: any[]): Promise<any> | void;
}

// Keep track of all handlers that have been registered
let handlers: {[key: string]: ActionHandler[]} = {};

// The actual middleware function: after dispatching an action, calls any callbacks that are subscribed to that action
export function stitch(next: DispatchFunction, action: ActionFunction, actionType: string, args: IArguments, actionContext: ActionContext) {
    let returnValue = next(action, actionType, args, actionContext);

    if (actionType && handlers[actionType]) {
        handlers[actionType].forEach(handler => handler.apply(null, args));
    }

    return returnValue;
}

// Subscribe to an action
export function subscribe<T extends ActionHandler>(actionType: string, callback: T) {
    if (!handlers[actionType]) {
        handlers[actionType] = [];
    }

    handlers[actionType].push(callback);
}

export function raise<T extends ActionHandler>(actionType: string, callback?: (actionToExecute: T) => void) {
    console.error("[satcheljs-stitch] The 'raise' API is deprecated.  Use 'raiseAction' instead.");

    // Create a no-op action to execute
    let actionToExecute = action(actionType)(() => {});

    if (callback) {
        // Pass it to the callback so that the consumer can call it with arguments
        callback(<T>actionToExecute);
    } else {
        // No callback was provided, so just execute it with no arguments
        actionToExecute();
    }
}

export function raiseAction<T extends ActionHandler>(actionType: string): T {
    // Create a no-op action to execute
    return <T>action(actionType)(() => {});
}
