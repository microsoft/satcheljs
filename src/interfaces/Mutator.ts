import ActionCreator from './ActionCreator';
import type ActionMessage from './ActionMessage';
import type MutatorFunction from './MutatorFunction';

type Mutator<TAction extends ActionMessage, TReturn> = {
    type: 'mutator';
    actionCreator: ActionCreator<TAction>;
    target: MutatorFunction<TAction, TReturn>;
};
export default Mutator;
