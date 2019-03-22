import { Reaction, IObservableValue, isObservableArray } from 'mobx';
import { getOriginalTarget, getActionType, setActionType } from './functionInternals';
import { getGlobalContext } from '../globalContext';

export type SelectorFunction<T> = { [key in keyof T]?: (...args: any[]) => T[key] };

function createCursorFromSelector<T>(selector: SelectorFunction<T>, args?: any) {
    let state: any = {};

    Object.keys(selector).forEach((key: string) => {
        if (typeof state[key] === typeof undefined) {
            Object.defineProperty(state, key, {
                enumerable: true,
                get: () => selector[key as keyof T].apply(null, args),
            });
        }
    });

    Object.freeze(state);

    return state;
}

/**
 * Decorator for action functions. Selects a subset from the state tree for the action.
 */
export default function select<T>(selector: SelectorFunction<T>) {
    return function decorator<Target extends Function>(target: Target): Target {
        // do not execute the selector function in test mode, simply returning
        // the target that was passed in
        if (getGlobalContext().legacyTestMode) {
            return target;
        }

        let context = this;
        let argumentPosition = target.length - 1;
        let actionTarget = getOriginalTarget(target);

        if (actionTarget) {
            argumentPosition = actionTarget.length - 1;
        }

        let returnValue: any = function() {
            let state = createCursorFromSelector<T>(selector, arguments);
            let args = Array.prototype.slice.call(arguments);
            if (typeof args[argumentPosition] === typeof undefined) {
                for (var i = args.length; i < argumentPosition; i++) {
                    args[i] = undefined;
                }
                args[argumentPosition] = state;
            }
            return target.apply(context, args);
        };

        setActionType(returnValue, getActionType(<any>target));
        return <Target>returnValue;
    };
}
