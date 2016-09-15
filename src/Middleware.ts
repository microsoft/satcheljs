import DispatchFunction from './DispatchFunction';
import ActionFunction from './ActionFunction';

interface Middleware {
    (next: DispatchFunction, action: ActionFunction, actionType: string, args: IArguments, actionContext: { [key: string]: any }): void;
}

export default Middleware;
