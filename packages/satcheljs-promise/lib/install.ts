import { setOriginalThenCatch, wrappedThen, wrappedCatch } from './actionWrappers';

let isInstalled = false;

export default function install() {
    if (!isInstalled) {
        setOriginalThenCatch(Promise.prototype.then, Promise.prototype.catch);
        Promise.prototype.then = <any>wrappedThen;
        Promise.prototype.catch = <any>wrappedCatch;
        isInstalled = true;
    }
}
