import 'jasmine';
import * as actionWrappers from '../src/actionWrappers';
import install from '../src/install';

describe("install", () => {

    let originalThen = Promise.prototype.then;
    let originalCatch = Promise.prototype.catch;

    let wrappedThen = () => {};
    let wrappedCatch = () => {};

    beforeEach(() => {
        spyOn(actionWrappers, 'wrapThen').and.returnValue(wrappedThen);
        spyOn(actionWrappers, 'wrapCatch').and.returnValue(wrappedCatch);
    });

    afterEach(() => {
        Promise.prototype.then = originalThen;
        Promise.prototype.catch = originalCatch;
    });

    it("wraps Promise.then and Promise.catch", () => {
        // Act
        install();

        // Assert
        expect(Promise.prototype.then).toBe(wrappedThen);
        expect(Promise.prototype.catch).toBe(wrappedCatch);
    });

    it("returns an uninstall function to restore the original then and catch", () => {
        // Arrange
        let uninstall = install();

        // Act
        uninstall();

        // Assert
        expect(Promise.prototype.then).toBe(originalThen);
        expect(Promise.prototype.catch).toBe(originalCatch);
    });

});
