import 'jasmine';
import * as satcheljs from 'satcheljs';
import * as promiseMiddleware from '../lib/promiseMiddleware';
import { setOriginalThenCatch, wrappedThen, wrappedCatch } from '../lib/actionWrappers';

describe("actionWrappers", () => {

    let originalThenSpy: jasmine.Spy;
    let originalCatchSpy: jasmine.Spy;
    let getCurrentActionSpy: jasmine.Spy;

    beforeEach(() => {
        spyOn(satcheljs, "action").and.returnValue((callback: Function) => callback);
        getCurrentActionSpy = spyOn(promiseMiddleware, "getCurrentAction");
        originalThenSpy = jasmine.createSpy("originalThen");
        originalCatchSpy = jasmine.createSpy("originalCatch");
        setOriginalThenCatch(originalThenSpy, originalCatchSpy);
    });

    it("just pass through null callbacks", () => {
        // Act
        wrappedThen(null, null);
        wrappedCatch(null);

        // Assert
        expect(originalThenSpy).toHaveBeenCalledWith(null, null);
        expect(originalCatchSpy).toHaveBeenCalledWith(null);
    });

    it("when not in an action, just pass through the original callbacks", () => {
        // Arrange
        let onFulfilled = () => {};
        let onRejected = () => {};

        // Act
        wrappedThen(onFulfilled, onRejected);
        wrappedCatch(onRejected);

        // Assert
        expect(originalThenSpy).toHaveBeenCalledWith(onFulfilled, onRejected);
        expect(originalCatchSpy).toHaveBeenCalledWith(onRejected);
    });

    it("when in an action, wrap the callbacks in actions", () => {
        // Arrange
        getCurrentActionSpy.and.returnValue("testAction");

        let onFulfilled = jasmine.createSpy("onFulfilled");
        let onRejectedInThen = jasmine.createSpy("onRejectedInThen");
        wrappedThen(onFulfilled, onRejectedInThen);

        let onRejectedInCatch = jasmine.createSpy("onRejectedInCatch");
        wrappedCatch(onRejectedInCatch);

        // Act / Assert
        fulfillPromise();
        expect(satcheljs.action).toHaveBeenCalledWith("testAction => then");
        expect(onFulfilled).toHaveBeenCalled();

        rejectPromiseInThen();
        expect(satcheljs.action).toHaveBeenCalledWith("testAction => then_rejected");
        expect(onRejectedInThen).toHaveBeenCalled();

        rejectPromiseInCatch();
        expect(satcheljs.action).toHaveBeenCalledWith("testAction => catch");
        expect(onRejectedInCatch).toHaveBeenCalled();
    });

    it("handle callback parameters and return value", () => {
        // Arrange
        getCurrentActionSpy.and.returnValue("testAction");
        let onFulfilled = jasmine.createSpy("onFulfilled").and.returnValue("returnValue");

        // Act
        wrappedThen(onFulfilled, null);

        // Simulate the promise being fulfilled
        let returnValue = fulfillPromise("arg");

        // Assert
        expect(returnValue).toBe("returnValue");
        expect(onFulfilled).toHaveBeenCalledWith("arg");
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
