import type ActionCreator from './interfaces/ActionCreator';
import type ActionMessage from './interfaces/ActionMessage';

type PrivatePropertyTarget = ActionCreator<ActionMessage> | ActionMessage;

// Module-private so the metadata can't be modified by consumers or serialized with action messages
const actionIds = new WeakMap<PrivatePropertyTarget, string>();
const actionTypes = new WeakMap<PrivatePropertyTarget, string>();

export function getPrivateActionId(target: PrivatePropertyTarget): string | undefined {
    return actionIds.get(target);
}

export function setPrivateActionId(target: PrivatePropertyTarget, actionId: string): void {
    actionIds.set(target, actionId);
}

export function getPrivateActionType(target: PrivatePropertyTarget): string {
    return actionTypes.get(target) || 'unknown action';
}

export function setPrivateActionType(target: PrivatePropertyTarget, actionType: string): void {
    actionTypes.set(target, actionType);
}
