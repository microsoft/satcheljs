import { action } from 'mobx';

import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getPrivateActionId } from './actionCreator';
import { subscribe } from './dispatcher';

export function mutator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: Subscriber<T>
): Subscriber<T> {
    let actionId = getPrivateActionId(actionCreator);
    if (!actionId) {
        throw new Error('Mutators can only subscribe to action creators.');
    }

    // Wrap the callback in a MobX action so it can modify the store
    subscribe(actionId, action(target));
    return target;
}
