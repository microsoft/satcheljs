import ActionMessage from './ActionMessage';

// if the return type is void, then it can be a function. Or else it should never happen.
// this is how we ensure that all functions passed in have a return type of void
type MutatorFunction<TAction extends ActionMessage, TReturn> = void extends TReturn
    ? (actionMessage: TAction) => TReturn
    : never;
export default MutatorFunction;
