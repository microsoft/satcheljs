import type ActionCreator from './interfaces/ActionCreator';
import type ActionMessage from './interfaces/ActionMessage';
import type SatchelState from './interfaces/SatchelState';
import { getPrivateActionId, getPrivateActionType } from './privatePropertyUtils';

/**
 * Throws if the action creator or action message was created by a different satchel instance.
 * Objects without an action ID (e.g. plain action messages) aren't owned by any satchel and are allowed.
 */
export default function assertOwnedBySatchel(
    state: SatchelState,
    target: ActionCreator<ActionMessage> | ActionMessage
): void {
    const actionId = getPrivateActionId(target);
    if (actionId !== undefined && !state.subscriptions.has(actionId)) {
        const actionType = (target as ActionMessage).type || getPrivateActionType(target);
        throw new Error(`Action (${actionType}) was created by a different satchel instance.`);
    }
}
