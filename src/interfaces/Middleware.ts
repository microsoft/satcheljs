import type ActionMessage from './ActionMessage';
import type DispatchFunction from './DispatchFunction';

type Middleware = (next: DispatchFunction, actionMessage: ActionMessage) => void;
export default Middleware;
