import 'jasmine';
import * as actionWrappers from '../../../src/legacy/promise/actionWrappers';
import install from '../../../src/legacy/promise/install';

describe('install', () => {
    let originalThen = Promise.prototype.then;
    let originalCatch = Promise.prototype.catch;

    let wrappedThen = () => {};
    let wrappedCatch = () => {};

    it('wraps Promise.then and Promise.catch', () => {
        try {
            // Arrange
            setupPromise();

            // Act
            install();

            // Assert
            expect(Promise.prototype.then).toBe(wrappedThen);
            expect(Promise.prototype.catch).toBe(wrappedCatch);
        } finally {
            resetPromise();
        }
    });

    it('returns an uninstall function to restore the original then and catch', () => {
        try {
            // Arrange
            setupPromise();
            let uninstall = install();

            // Act
            uninstall();

            // Assert
            expect(Promise.prototype.then).toBe(originalThen);
            expect(Promise.prototype.catch).toBe(originalCatch);
        } finally {
            resetPromise();
        }
    });

    // NOTE!!!! Promise can only be overridden INSIDE the test function body, or else jest will not finish
    function setupPromise() {
        spyOn(actionWrappers, 'wrapThen').and.returnValue(wrappedThen);
        spyOn(actionWrappers, 'wrapCatch').and.returnValue(wrappedCatch);
    }

    function resetPromise() {
        Promise.prototype.then = originalThen;
        Promise.prototype.catch = originalCatch;
    }
});
