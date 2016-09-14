import ActionFunction from './ActionFunction';

interface DispatchFunction {
    (action: ActionFunction, actionType: string, args: IArguments, options?: any): Promise<any> | void;
}

export default DispatchFunction;
