import DispatchFunction from './DispatchFunction';
import ActionFunction from './ActionFunction';

interface Middleware {
    (next: DispatchFunction, action: ActionFunction, actionType: string, args: IArguments, options?: any): void;
}

export default Middleware;
