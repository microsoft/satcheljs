import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import MutatorFunction from './interfaces/MutatorFunction';
import { Mutator } from './interfaces/Mutator';
import { setPrivateSubscriberRegistered } from './privatePropertyUtils';

export default function mutator<TAction extends ActionMessage, TReturn>(
    actionCreator: ActionCreator<TAction>,
    target: MutatorFunction<TAction, TReturn>
): Mutator<TAction, TReturn> {
    const mutator: Mutator<TAction, TReturn> = {
        type: 'mutator',
        actionCreator,
        target,
    };

    setPrivateSubscriberRegistered(mutator, false);

    return mutator;
}
