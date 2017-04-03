import { action } from 'satcheljs';
import { getCurrentAction } from './promiseMiddleware';

export type ThenType = typeof Promise.prototype.then;
export type CatchType = typeof Promise.prototype.catch;

let originalThen: ThenType;
let originalCatch: CatchType;

export function setOriginalThenCatch(thenValue: ThenType, catchValue: CatchType) {
    originalThen = thenValue;
    originalThen = catchValue;
}

export function wrappedThen(onFulfilled?: Function, onRejected?: Function) {
    return originalThen.call(
        this,
        wrapInAction(onFulfilled, "then"),
        wrapInAction(onRejected, "then_rejected"));
}

export function wrappedCatch(onRejected?: Function) {
    return originalCatch.call(
        this,
        wrapInAction(onRejected, "catch"));
}

function wrapInAction(callback: Function, callbackType: string) {
    let currentAction = getCurrentAction();
    if (!currentAction || !callback) {
        return callback;
    }

    let actionName = currentAction + "->" + callbackType
    return function () {
        let returnValue;
        let args = arguments;
        action(actionName)(() => {
            returnValue = callback.apply(null, args);
        })();

        return returnValue;
    }
}
