export function getPrivateActionId(target: any) {
    return target.__SATCHELJS_ACTION_ID;
}

export function setPrivateActionId(target: any, actionId: string) {
    target.__SATCHELJS_ACTION_ID = actionId;
}

export function getPrivateActionType(target: any): string {
    return target.__SATCHELJS_ACTION_TYPE || 'unknown action';
}

export function setActionType(target: any, actionType: string) {
    target.__SATCHELJS_ACTION_TYPE = actionType;
}

export const setPrivateSubscriberRegistered = (target: any, isRegistered: boolean) => {
    target.__SATCHELJS_SUBSCRIBER_REGISTERED = isRegistered;
};

export const getPrivateSubscriberRegistered = (target: any): boolean => {
    return target.__SATCHELJS_SUBSCRIBER_REGISTERED;
};

export const setPrivateFunction = (property: string, target: any, func: any) => {
    target[property] = func;
};
