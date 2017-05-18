import ActionMessage from './interfaces/ActionMessage';
import ActionCreator from './interfaces/ActionCreator';

export default function actionCreator<T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
    actionType: string,
    target: TActionCreator): TActionCreator
{
    let decoratedTarget = function createAction(...args: any[]) {
        let actionMessage: ActionMessage = target.apply(null, args);

        // Ideally we'd just stamp the type property on the action message at this point, but
        // if the consumer doesn't include it then TypeScript infers that it is not there and,
        // as far as the compiler is concerned, it won't be available on the returned type.
        // This issue should improve things: https://github.com/Microsoft/TypeScript/issues/5453
        if (actionMessage.type != actionType) {
            throw new Error("The action type must match the type property on the action message.");
        }

        return actionMessage;
    } as TActionCreator;

    setActionType(decoratedTarget, actionType);
    return decoratedTarget;
};

export function getActionType(target: ActionCreator<any>) {
    return (target as any).__SATCHELJS_ACTION_TYPE_V2;
}

export function setActionType(target: ActionCreator<any>, actionType: string) {
    (target as any).__SATCHELJS_ACTION_TYPE_V2 = actionType;
}
