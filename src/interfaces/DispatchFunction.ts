import type ActionMessage from './ActionMessage';

type DispatchFunction = (actionMessage: ActionMessage) => void | Promise<void>;
export default DispatchFunction;
