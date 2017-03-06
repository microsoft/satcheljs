import ActionContext from './ActionContext';
import dispatch from './dispatch';
import {setOriginalTarget} from './functionInternals';

export interface RawAction {
    (... args: any[]): Promise<any> | void;
}

export interface Action {
    actionType?: string;
}

export interface ActionFactory {
    <T extends RawAction>(target: T): T & Action;
    <T extends RawAction>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): void;
}

export default function action(actionType: string, actionContext?: ActionContext): ActionFactory {
    return function createAction(arg0: any, arg1: any, arg2: any) {
        if (arguments.length == 1 && typeof arg0 == "function") {
            return wrapFunctionInAction(arg0, actionType, actionContext);
        } else {
            decorateClassMethod(arg0, arg1, arg2, actionType, actionContext);
        }
    } as ActionFactory;
}

function wrapFunctionInAction<T extends RawAction>(target: T, actionType: string, actionContext: ActionContext): T & Action {
    let decoratedTarget: T & Action = <T>function() {
        let returnValue: any;
        let passedArguments = arguments;

        dispatch(
            () => { returnValue = target.apply(this, passedArguments); return returnValue; },
            actionType,
            arguments,
            actionContext);

        return returnValue;
    };
    decoratedTarget.actionType = actionType;

    setOriginalTarget(decoratedTarget, target);

    return decoratedTarget;
}

function decorateClassMethod<T extends RawAction>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
    actionType: string,
    actionContext: ActionContext)
{
    if (descriptor && typeof descriptor.value == "function") {
        descriptor.value = wrapFunctionInAction(descriptor.value, actionType, actionContext);
    } else {
        throw new Error("The @action decorator can only apply to class methods.");
    }
}
