import ActionFunction from './ActionFunction';

interface DispatchFunction {
    (action: ActionFunction, actionType: string, args: IArguments,  middlewareOptions: { [key: string]: any }): Promise<any> | void;
}

export default DispatchFunction;
