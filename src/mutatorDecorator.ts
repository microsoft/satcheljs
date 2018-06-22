import { action } from 'mobx';

import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import MutatorFunction from './interfaces/MutatorFunction';
import { getPrivateActionId } from './actionCreator';
import { subscribe } from './dispatcher';
import { getGlobalContext } from './globalContext';
import wrapMutator from './wrapMutator';

export default function mutator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: MutatorFunction<T>
): MutatorFunction<T> {
    let actionId = getPrivateActionId(actionCreator);
    if (!actionId) {
        throw new Error('Mutators can only subscribe to action creators.');
    }

    // Subscribe to the action
    subscribe(actionId, wrapMutator(target));

    // Return the original function so it can be exported for tests
    return target;
}
