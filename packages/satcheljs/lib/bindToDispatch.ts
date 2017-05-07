import ActionMessage from './interfaces/ActionMessage';
import ActionCreator from './interfaces/ActionCreator';
import { dispatch } from './dispatcher';
import { getActionType, setActionType } from './actionCreator';

export default function bindToDispatch<T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
    target: TActionCreator): TActionCreator
{
    let decoratedTarget = function createAndDispatch(...args: any[]) {
        let actionMessage = target.apply(null, args);
        dispatch(actionMessage);
        return actionMessage;
    } as TActionCreator;

    setActionType(decoratedTarget, getActionType(target));
    return decoratedTarget;
}
