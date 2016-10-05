import {isObservableMap} from 'mobx';

export function isPlainObject(value: any) {
    return value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;
}

export function isFunction(value: any) {
    return value !== null && typeof value === "function";
}

export function isSameType(source: any, target: any) {
    return (isObservableMap(source) && isObservableMap(target) == true)
            || (Array.isArray(source) && Array.isArray(target) == true)
            || (isPlainObject(source) && isPlainObject(target) == true)
            || (isFunction(source) && isFunction(target) == true)
            || (typeof source == typeof target && typeof source != "object")
}