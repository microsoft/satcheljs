import RawAction from './RawAction';

export function setOriginalTarget(decoratedTarget: any, originalTarget: any) {
    decoratedTarget.__SATCHELJS_ORIGINAL_TARGET = originalTarget;
}

export function getOriginalTarget(decoratedTarget: any) {
    if (typeof decoratedTarget.__SATCHELJS_ORIGINAL_TARGET !== typeof undefined) {
        return decoratedTarget.__SATCHELJS_ORIGINAL_TARGET;
    }

    return undefined;
}

export function setActionType(decoratedTarget: any, actionType: string) {
    decoratedTarget.__SATCHELJS_ACTION_TYPE = actionType;
}

export function getActionType(decoratedTarget: RawAction) {
    return (<any>decoratedTarget).__SATCHELJS_ACTION_TYPE;
}
