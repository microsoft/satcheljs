import ActionMessage from './interfaces/ActionMessage';
import ActionCreator from './interfaces/ActionCreator';
import { dispatch } from './dispatcher';

export function actionCreator<T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
    actionType: string,
    target: TActionCreator): TActionCreator
{
    setActionType(target, actionType);
    return target;
};

export function boundActionCreator<T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
    actionType: string,
    target: TActionCreator): TActionCreator
{
    let decoratedTarget = function createAction(...args: any[]) {
        let actionMessage: ActionMessage = target.apply(null, args);
        dispatch(actionMessage);
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
