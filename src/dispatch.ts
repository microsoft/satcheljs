import {useStrict, spy, action as mobxAction} from 'mobx';
import ActionFunction from './ActionFunction';
import DispatchFunction from './DispatchFunction';
import { dispatchWithMiddleware } from './applyMiddleware';

var inDispatch: number = 0;

export default function dispatch(action: ActionFunction, actionType: string, args: IArguments,  middlewareOptions: { [key: string]: any }): void {
    inDispatch++;

    mobxAction(
        actionType ? actionType : "(anonymous action)",
        () => {
            dispatchWithMiddleware(action, actionType, args, middlewareOptions);
        })();

    inDispatch--;
}

// Guard against state changes happening outside of SatchelJS actions
useStrict(true);

spy((change) => {
    if (!inDispatch && change.type == "action") {
        throw new Error('The state may only be changed by a SatchelJS action.');
    }
});
