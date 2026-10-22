import createActionId from './createActionId';
import type ActionCreator from './interfaces/ActionCreator';
import type ActionMessage from './interfaces/ActionMessage';
import type SatchelState from './interfaces/SatchelState';
import { setPrivateActionId, setPrivateActionType } from './privatePropertyUtils';

function createActionCreator<T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
    state: SatchelState,
    actionType: string,
    target: TActionCreator | undefined,
    dispatch: ((actionMessage: ActionMessage) => void) | undefined
): TActionCreator {
    const actionId = createActionId();

    // Reserve an entry so the satchel can recognize the actions it created
    state.subscriptions.set(actionId, []);

    const decoratedTarget = function createAction(...args: any[]) {
        // Create the action message
        const actionMessage: ActionMessage = target ? target.apply(null, args) : {};

        if (actionMessage.type) {
            throw new Error('Action creators should not include the type property.');
        }

        // Stamp the action message with the type and the private ID
        actionMessage.type = actionType;
        setPrivateActionId(actionMessage, actionId);

        // Dispatch if necessary
        if (dispatch) {
            dispatch(actionMessage);
        }

        return actionMessage;
    } as TActionCreator;

    // Stamp the action creator function with the private ID
    setPrivateActionId(decoratedTarget, actionId);
    setPrivateActionType(decoratedTarget, actionType);
    return decoratedTarget;
}

export function createActionCreatorFactory(state: SatchelState) {
    return function actionCreator<
        T extends ActionMessage = {},
        TActionCreator extends ActionCreator<T> = () => T,
    >(actionType: string, target?: TActionCreator): TActionCreator {
        return createActionCreator(state, actionType, target, undefined);
    };
}

export function createActionFactory(
    state: SatchelState,
    dispatch: (actionMessage: ActionMessage) => void
) {
    return function action<
        T extends ActionMessage = {},
        TActionCreator extends ActionCreator<T> = () => T,
    >(actionType: string, target?: TActionCreator): TActionCreator {
        return createActionCreator(state, actionType, target, dispatch);
    };
}
