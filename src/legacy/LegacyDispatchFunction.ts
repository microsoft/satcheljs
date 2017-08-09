import ActionContext from './ActionContext';
import ActionFunction from './ActionFunction';

interface DispatchFunction {
    (
        action: ActionFunction,
        actionType: string,
        args: IArguments,
        actionContext: ActionContext
    ): Promise<any> | void;
}

export default DispatchFunction;
