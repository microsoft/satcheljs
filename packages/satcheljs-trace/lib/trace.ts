import { DispatchFunction, ActionFunction, ActionContext } from 'satcheljs';

export default function trace(next: DispatchFunction, action: ActionFunction, actionType: string, args: IArguments, actionContext: ActionContext) {
    groupStart("Executing action: " + (actionType ? actionType : "(anonymous action)"));

    try {
        return next(action, actionType, args, actionContext);
    }
    finally {
        groupEnd();
    }
}

function groupStart(message: string) {
    if (typeof console.group == "function") {
        console.group(message);
    } else {
        console.log(message);
    }
}

function groupEnd() {
    if (typeof console.groupEnd == "function") {
        console.groupEnd();
    }
}
