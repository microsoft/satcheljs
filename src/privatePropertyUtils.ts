export function getPrivateActionId(target: any): string {
    return target.__SATCHELJS_ACTION_ID;
}

export function setPrivateActionId(target: any, actionId: string) {
    target.__SATCHELJS_ACTION_ID = actionId;
}

export function getPrivateActionType(target: any): string {
    return target.__SATCHELJS_ACTION_TYPE || 'unknown action';
}

export function setPrivateActionType(target: any, actionType: string) {
    target.__SATCHELJS_ACTION_TYPE = actionType;
}

/**
 * Returns the token of the satchel instance that created the action creator or action message,
 * or undefined if it was not created by a satchel.
 */
export function getPrivateSatchelOwner(target: any): object | undefined {
    return target.__SATCHELJS_OWNER;
}

export function setPrivateSatchelOwner(target: any, owner: object) {
    // Non-enumerable so it doesn't show up when action messages are serialized or spread
    Object.defineProperty(target, '__SATCHELJS_OWNER', {
        value: owner,
        enumerable: false,
        configurable: true,
        writable: true,
    });
}
