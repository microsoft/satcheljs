import {useStrict, spy, action as mobxAction} from 'mobx';
import ActionContext from './ActionContext';
import ActionFunction from './ActionFunction';
import DispatchFunction from './DispatchFunction';
import { dispatchWithMiddleware } from './applyMiddleware';
import { getGlobalContext } from './globalContext';

export default function dispatch(action: ActionFunction, actionType: string, args: IArguments,  actionContext: ActionContext): void {
    getGlobalContext().inDispatch++;

    mobxAction(
        actionType ? actionType : "(anonymous action)",
        () => {
            dispatchWithMiddleware(action, actionType, args, actionContext);
        })();

    getGlobalContext().inDispatch--;
}

// Guard against state changes happening outside of SatchelJS actions
useStrict(true);

spy((change) => {
    if (!getGlobalContext().inDispatch && change.type == "action") {
        throw new Error('The state may only be changed by a SatchelJS action.');
    }
});
