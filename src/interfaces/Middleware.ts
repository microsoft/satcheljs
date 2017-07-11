import ActionMessage from './ActionMessage';
import DispatchFunction from './DispatchFunction';

type Middleware = (next: DispatchFunction, actionMessage: ActionMessage) => void;
export default Middleware;
