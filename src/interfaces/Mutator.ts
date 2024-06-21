import ActionCreator from './ActionCreator';
import ActionMessage from './ActionMessage';
import MutatorFunction from './MutatorFunction';

export type Mutator<TAction extends ActionMessage, TReturn> = {
    type: 'mutator';
    actionCreator: ActionCreator<TAction>;
    target: MutatorFunction<TAction, TReturn>;
    isRegistered: boolean;
};
