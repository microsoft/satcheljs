import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import MutatorFunction from './interfaces/MutatorFunction';
import { Mutator } from './interfaces/Mutator';

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
