import ActionMessage from './ActionMessage';

type ActionCreator<T extends ActionMessage> = (...args: any[]) => T;
export default ActionCreator;
