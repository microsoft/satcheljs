import ActionFunction from './ActionFunction';

interface DispatchFunction {
    (action: ActionFunction, actionType: string, args: IArguments): Promise<any> | void;
}

export default DispatchFunction;
