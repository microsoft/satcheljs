import * as Perf from 'react-addons-perf';
import { DispatchFunction, ActionFunction, ActionContext } from 'satcheljs';

// Make react perf tools available from the console
(<any>window).Perf = Perf;

let isTrackingPerf = false;
let actionDepth = 0;
let rootActions: string[] = [];

export default function perfMiddleware(next: DispatchFunction, action: ActionFunction, actionType: string, args: IArguments, actionContext: ActionContext) {
    if (!isTrackingPerf) {
        startTrackingPerf();
    }

    // Ignore actions that are called recursively from other actions
    if (!actionDepth) {
        rootActions.push(actionType);
    }

    actionDepth++;

    try {
        // Call the next link in the middleware chain
        return next(action, actionType, args, actionContext);
    }
    finally {
        actionDepth--;
    }
}

function startTrackingPerf() {
    Perf.start();
    isTrackingPerf = true;

    // Start a new root actions list for this thread
    rootActions = [];

    // Stop tracking perf at the next animation frame
    window.requestAnimationFrame(stopTrackingPerf);
}

function stopTrackingPerf() {
    Perf.stop();
    isTrackingPerf = false;

    // If there was more than one root action, print a warning
    if (rootActions.length > 1) {
        console.error("Multiple actions were executed sequentially.  They should be batched into a single action so that React only needs to render once.  Actions: " + rootActions.join(", "));
    }

    // If there were wasted renders, print them to the console
    if (Perf.getWasted().length) {
        console.error("Wasted renders");
        Perf.printWasted();
    }
}
