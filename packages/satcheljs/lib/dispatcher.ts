import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import { notifySubscribers } from './subscriptions';

let actionQueue: ActionMessage[] = [];
let isDrainingQueue = false;

export function dispatch(actionMessage: ActionMessage) {
    // Add the action message to the queue
    actionQueue.push(actionMessage);

    // If we aren't already in the process of draining the queue, do so now
    if (!isDrainingQueue) {
        drainQueue();
    }
}

function drainQueue() {
    isDrainingQueue = true;

    try {
        // Subscribers may dispatch more actions, so keep going until the queue
        // is empty
        while (actionQueue.length) {
            let actionMessage = actionQueue.shift();
            notifySubscribers(actionMessage);
        }
    }
    finally {
        // The queue should always be empty at this point.  If some subscriber
        // threw an exception we still clear out the queue so that we're in a
        // good state for the next action that gets dispatched.
        isDrainingQueue = false;
        actionQueue = [];
    }
}
