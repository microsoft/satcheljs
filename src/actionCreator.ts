import ActionMessage from './interfaces/ActionMessage';
import ActionCreator from './interfaces/ActionCreator';
import { dispatch } from './dispatcher';
import createActionId from './createActionId';

export function actionCreator<
    T extends ActionMessage = {},
    TActionCreator extends ActionCreator<T> = () => T
>(actionType: string, target?: TActionCreator): TActionCreator {
    return createActionCreator(actionType, target, false);
}

export function action<
    T extends ActionMessage = {},
    TActionCreator extends ActionCreator<T> = () => T
>(actionType: string, target?: TActionCreator): TActionCreator {
    return createActionCreator(actionType, target, true);
}

function createActionCreator<T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
    actionType: string,
    target: TActionCreator,
    shouldDispatch: boolean
): TActionCreator {
    let actionId = createActionId();

    let decoratedTarget = function createAction(...args: any[]) {
        // Create the action message
        let actionMessage: ActionMessage = target ? target.apply(null, args) : {};

        // Stamp the action type
        if (actionMessage.type) {
            throw new Error('Action creators should not include the type property.');
        }

        // Stamp the action message with the type and the private ID
        actionMessage.type = actionType;
        setPrivateActionId(actionMessage, actionId);

        // Dispatch if necessary
        if (shouldDispatch) {
            dispatch(actionMessage);
        }

        return actionMessage;
    } as TActionCreator;

    // Stamp the action creator function with the private ID
    setPrivateActionId(decoratedTarget, actionId);
    setActionType(decoratedTarget, actionType);
    return decoratedTarget;
}

export function getPrivateActionId(target: any) {
    return target.__SATCHELJS_ACTION_ID;
}

export function setPrivateActionId(target: any, actionId: string) {
    target.__SATCHELJS_ACTION_ID = actionId;
}

export function getPrivateActionType(target: any): string {
    return target.__SATCHELJS_ACTION_TYPE || 'unknown action';
}

export function setActionType(target: any, actionType: string) {
    target.__SATCHELJS_ACTION_TYPE = actionType;
}
