import { setOriginalThenCatch, wrappedThen, wrappedCatch } from './actionWrappers';

export function install() {
    setOriginalThenCatch(Promise.prototype.then, Promise.prototype.catch);
    Promise.prototype.then = <any>wrappedThen;
    Promise.prototype.catch = <any>wrappedCatch;
}
