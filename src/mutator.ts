import { action } from 'mobx';

import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import MutatorFunction from './interfaces/MutatorFunction';
import { getPrivateActionId } from './actionCreator';
import { subscribe } from './dispatcher';

export default function mutator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: MutatorFunction<T>
): MutatorFunction<T> {
    let actionId = getPrivateActionId(actionCreator);
    if (!actionId) {
        throw new Error('Mutators can only subscribe to action creators.');
    }

    // Wrap the callback in a MobX action so it can modify the store
    subscribe(actionId, action(target));
    return target;
}
