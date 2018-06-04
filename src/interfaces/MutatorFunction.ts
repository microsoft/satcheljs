import ActionMessage from './ActionMessage';

type MutatorFunction<T extends ActionMessage> = (actionMessage: T) => void;
export default MutatorFunction;
