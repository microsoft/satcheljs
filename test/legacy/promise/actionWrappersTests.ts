import 'jasmine';
import * as actionImports from '../../../src/legacy/action';
import * as promiseMiddleware from '../../../src/legacy/promise/promiseMiddleware';
import { wrapThen, wrapCatch } from '../../../src/legacy/promise/actionWrappers';

describe('actionWrappers', () => {
    let originalThenSpy: jasmine.Spy;
    let originalCatchSpy: jasmine.Spy;
    let getCurrentActionSpy: jasmine.Spy;

    beforeEach(() => {
        spyOn(actionImports, 'default').and.returnValue((callback: Function) => callback);
        getCurrentActionSpy = spyOn(promiseMiddleware, 'getCurrentAction');
        originalThenSpy = jasmine.createSpy('originalThen');
        originalCatchSpy = jasmine.createSpy('originalCatch');
    });

    it('just pass through null callbacks', () => {
        // Act
        wrapThen(originalThenSpy)(null, null);
        wrapCatch(originalCatchSpy)(null);

        // Assert
        expect(originalThenSpy).toHaveBeenCalledWith(null, null);
        expect(originalCatchSpy).toHaveBeenCalledWith(null);
    });

    it('wrap the callbacks in actions', () => {
        // Arrange
        getCurrentActionSpy.and.returnValue('testAction');

        let onFulfilled = jasmine.createSpy('onFulfilled');
        let onRejectedInThen = jasmine.createSpy('onRejectedInThen');
        wrapThen(originalThenSpy)(onFulfilled, onRejectedInThen);

        let onRejectedInCatch = jasmine.createSpy('onRejectedInCatch');
        wrapCatch(originalCatchSpy)(onRejectedInCatch);

        // Act / Assert
        fulfillPromise();
        expect(actionImports.default).toHaveBeenCalledWith('testAction => then');
        expect(onFulfilled).toHaveBeenCalled();

        rejectPromiseInThen();
        expect(actionImports.default).toHaveBeenCalledWith('testAction => then_rejected');
        expect(onRejectedInThen).toHaveBeenCalled();

        rejectPromiseInCatch();
        expect(actionImports.default).toHaveBeenCalledWith('testAction => catch');
        expect(onRejectedInCatch).toHaveBeenCalled();
    });

    it('handle callback parameters and return value', () => {
        // Arrange
        getCurrentActionSpy.and.returnValue('testAction');
        let onFulfilled = jasmine.createSpy('onFulfilled').and.returnValue('returnValue');

        // Act
        wrapThen(originalThenSpy)(onFulfilled, null);

        // Simulate the promise being fulfilled
        let returnValue = fulfillPromise('arg');

        // Assert
        expect(returnValue).toBe('returnValue');
        expect(onFulfilled).toHaveBeenCalledWith('arg');
    });

    function fulfillPromise(arg?: any) {
        return originalThenSpy.calls.argsFor(0)[0](arg);
    }

    function rejectPromiseInThen(arg?: any) {
        return originalThenSpy.calls.argsFor(0)[1](arg);
    }

    function rejectPromiseInCatch(arg?: any) {
        return originalCatchSpy.calls.argsFor(0)[0](arg);
    }
});
