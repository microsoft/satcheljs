import { action as mobxAction } from 'mobx';
import assertOwnedBySatchel from './assertOwnedBySatchel';
import type ActionCreator from './interfaces/ActionCreator';
import type ActionMessage from './interfaces/ActionMessage';
import type Mutator from './interfaces/Mutator';
import type SatchelState from './interfaces/SatchelState';
import type Subscriber from './interfaces/Subscriber';
import { getPrivateActionId, getPrivateActionType } from './privatePropertyUtils';

function wrapMutatorTarget<TAction extends ActionMessage, TReturn>(
    state: SatchelState,
    { actionCreator, target }: Mutator<TAction, TReturn>
) {
    // Wrap the callback in a MobX action so it can modify the store
    const actionType = getPrivateActionType(actionCreator);
    return mobxAction(actionType, (actionMessage: TAction) => {
        try {
            state.currentMutator = actionType;
            target(actionMessage);
            state.currentMutator = null;
        } catch (e) {
            state.currentMutator = null;
            throw e;
        }
    });
}

export function createRegister(state: SatchelState) {
    return function register<TAction extends ActionMessage, TReturn = void>(
        subscriber: Subscriber<TAction, TReturn>
    ): void {
        if (state.registeredSubscribers.has(subscriber)) {
            // If the subscriber is already registered with this satchel, no-op.
            return;
        }

        const actionId = getPrivateActionId(subscriber.actionCreator);
        if (actionId === undefined) {
            throw new Error(`A ${subscriber.type} can only subscribe to action creators.`);
        }

        assertOwnedBySatchel(state, subscriber.actionCreator);

        const wrappedTarget =
            subscriber.type == 'mutator' ? wrapMutatorTarget(state, subscriber) : subscriber.target;

        state.subscriptions.get(actionId).push(wrappedTarget);
        state.registeredSubscribers.set(subscriber, true);
    };
}

export function createHasSubscribers(state: SatchelState) {
    return function hasSubscribers(actionCreator: ActionCreator<ActionMessage>): boolean {
        return (state.subscriptions.get(getPrivateActionId(actionCreator))?.length ?? 0) > 0;
    };
}
