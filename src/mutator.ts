import { action } from 'mobx';
import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import MutatorFunction from './interfaces/MutatorFunction';
import { getPrivateActionType, getPrivateActionId } from './actionCreator';
import { subscribe } from './dispatcher';
import { getGlobalContext } from './globalContext';

export default function mutator<TAction extends ActionMessage, TReturn>(
    actionCreator: ActionCreator<TAction>,
    target: MutatorFunction<TAction, TReturn>
): MutatorFunction<TAction, TReturn> {
    let actionId = getPrivateActionId(actionCreator);
    if (!actionId) {
        throw new Error('Mutators can only subscribe to action creators.');
    }

    // Wrap the callback in a MobX action so it can modify the store
    const actionType = getPrivateActionType(actionCreator);
    let wrappedTarget = action(actionType, (actionMessage: TAction) => {
        const globalContext = getGlobalContext();
        try {
            globalContext.currentMutator = actionType;
            target(actionMessage);
            globalContext.currentMutator = null;
        } catch (e) {
            globalContext.currentMutator = null;
            throw e;
        }
    });

    // Subscribe to the action
    subscribe(actionId, wrappedTarget);

    return target;
}
