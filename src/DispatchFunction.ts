import ActionFunction from './ActionFunction';

interface DispatchFunction {
    (action: ActionFunction, actionType: string, args: IArguments,  actionContext: { [key: string]: any }): Promise<any> | void;
}

export default DispatchFunction;
