import { action as mobxAction } from 'mobx';
import ActionContext from './ActionContext';
import ActionFunction from './ActionFunction';
import { dispatchWithMiddleware } from './legacyApplyMiddleware';
import { getGlobalContext } from '../globalContext';

export default function dispatch(
    action: ActionFunction,
    actionType: string,
    args: IArguments,
    actionContext: ActionContext
): void {
    getGlobalContext().legacyInDispatch++;

    mobxAction(
        actionType ? actionType : '(anonymous action)',
        dispatchWithMiddleware.bind(null, action, actionType, args, actionContext)
    )();

    getGlobalContext().legacyInDispatch--;
}
