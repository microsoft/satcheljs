import ActionMessage from './interfaces/ActionMessage';
import ActionCreator from './interfaces/ActionCreator';
import { dispatch } from './dispatcher';

export function actionCreator<T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
    actionType: string,
    target?: TActionCreator
): TActionCreator {
    return createActionCreator(actionType, target, false);
}

export function boundActionCreator<
    T extends ActionMessage,
    TActionCreator extends ActionCreator<T>
>(actionType: string, target?: TActionCreator): TActionCreator {
    return createActionCreator(actionType, target, true);
}

function createActionCreator<T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
    actionType: string,
    target: TActionCreator,
    shouldDispatch: boolean
): TActionCreator {
    let decoratedTarget = function createAction(...args: any[]) {
        // Create the action message
        let actionMessage: ActionMessage = target ? target.apply(null, args) : {};

        // Stamp the action type
        if (actionMessage.type) {
            throw new Error('Action creators should not include the type property.');
        }

        actionMessage.type = actionType;

        // Dispatch if necessary
        if (shouldDispatch) {
            dispatch(actionMessage);
        }

        return actionMessage;
    } as TActionCreator;

    setActionType(decoratedTarget, actionType);
    return decoratedTarget;
}

export function getActionType(target: ActionCreator<any>) {
    return (target as any).__SATCHELJS_ACTION_TYPE_V2;
}

function setActionType(target: ActionCreator<any>, actionType: string) {
    (target as any).__SATCHELJS_ACTION_TYPE_V2 = actionType;
}
