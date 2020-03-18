import { action } from 'mobx';

import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import MutatorFunction from './interfaces/MutatorFunction';
import { getPrivateActionType, getPrivateActionId } from './actionCreator';
import { subscribe } from './dispatcher';
import { getGlobalContext } from './globalContext';

export default function mutator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: MutatorFunction<T>
): MutatorFunction<T> {
    let actionId = getPrivateActionId(actionCreator);
    if (!actionId) {
        throw new Error('Mutators can only subscribe to action creators.');
    }

    // Wrap the callback in a MobX action so it can modify the store
    let wrappedTarget = action(getPrivateActionType(actionCreator), (actionMessage: T) => {
        try {
            getGlobalContext().currentMutator = actionMessage.type;
            if (target(actionMessage) as any) {
                throw new Error('Mutators cannot return a value and cannot be async.');
            }
        } finally {
            getGlobalContext().currentMutator = null;
        }
    });

    // Subscribe to the action
    subscribe(actionId, wrappedTarget);

    return target;
}
