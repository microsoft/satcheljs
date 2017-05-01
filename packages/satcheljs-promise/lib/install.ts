import { wrapThen, wrapCatch } from './actionWrappers';

export default function install() {
    let originalThen = Promise.prototype.then;
    let originalCatch = Promise.prototype.catch;

    Promise.prototype.then = wrapThen(originalThen);
    Promise.prototype.catch = wrapCatch(originalCatch);

    return function uninstall() {
        Promise.prototype.then = originalThen;
        Promise.prototype.catch = originalCatch;
    };
}
