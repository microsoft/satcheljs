import dispatch from './dispatch';

export interface RawAction {
    (... args: any[]): Promise<any> | void;
}

export default function action(actionType: string, actionContext?: { [key: string]: any }) {
    return function action<T extends RawAction>(target: T): T {
        let decoratedTarget = <T>function() {
            let returnValue: any;
            let passedArguments = arguments;

            dispatch(
                () => { returnValue = target.apply(undefined, passedArguments); },
                actionType,
                arguments,
                actionContext);

            return returnValue;
        };

        return decoratedTarget;
    }
}
