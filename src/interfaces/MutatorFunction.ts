import ActionMessage from './ActionMessage';

type MutatorFunction<T extends ActionMessage, U> = void extends U ? (actionMessage: T) => U : never;
export default MutatorFunction;
