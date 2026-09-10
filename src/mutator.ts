import type ActionCreator from './interfaces/ActionCreator';
import type ActionMessage from './interfaces/ActionMessage';
import type MutatorFunction from './interfaces/MutatorFunction';
import type Mutator from './interfaces/Mutator';
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
