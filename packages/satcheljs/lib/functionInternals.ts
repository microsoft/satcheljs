export function setOriginalTarget(decoratedTarget: any, originalTarget: any) {
    decoratedTarget.__SATCHELJS_ORIGINAL_TARGET = originalTarget;
}

export function getOriginalTarget(decoratedTarget: any) {
    if (typeof decoratedTarget.__SATCHELJS_ORIGINAL_TARGET !== typeof undefined) {
        return decoratedTarget.__SATCHELJS_ORIGINAL_TARGET;
    }
    
    return undefined;
}
