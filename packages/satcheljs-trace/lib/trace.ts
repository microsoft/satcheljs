import { DispatchFunction, ActionFunction, ActionContext } from 'satcheljs';

let depth = 0;

export default function trace(next: DispatchFunction, action: ActionFunction, actionType: string, args: IArguments, actionContext: ActionContext) {
    log("Executing action: " + (actionType ? actionType : "(anonymous action)"));

    try {
        depth++;
        return next(action, actionType, args, actionContext);
    }
    finally {
        depth--;
    }
}

function log(message: string) {
    let indentation = (new Array(depth)).join('  ');
    console.log(indentation + message);
}
