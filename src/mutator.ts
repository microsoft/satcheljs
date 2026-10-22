import type ActionCreator from './interfaces/ActionCreator';
import type ActionMessage from './interfaces/ActionMessage';
import type MutatorFunction from './interfaces/MutatorFunction';
import type Mutator from './interfaces/Mutator';

export default function mutator<TAction extends ActionMessage, TReturn>(
    actionCreator: ActionCreator<TAction>,
    target: MutatorFunction<TAction, TReturn>
): Mutator<TAction, TReturn> {
    return {
        type: 'mutator',
        actionCreator,
        target,
    };
}
