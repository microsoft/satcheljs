import 'jasmine';
import action from '../lib/action';
import * as dispatchImports from '../lib/dispatch';
import { getGlobalContext } from '../lib/globalContext';
import { getActionType } from '../lib/functionInternals';

describe("action", () => {
    it("wraps the function call in a dispatch", () => {
        let testFunctionCalled = false;
        let testFunction = (a: string) => { testFunctionCalled = true; };

        spyOn(dispatchImports, "default").and.callThrough();

        testFunction = action("testFunction")(testFunction);
        testFunction("testArgument");

        expect(testFunctionCalled).toBeTruthy();
        expect(dispatchImports.default).toHaveBeenCalledTimes(1);

        // The second argument to dispatch should be the actionType
        expect((<jasmine.Spy>dispatchImports.default).calls.argsFor(0)[1]).toBe("testFunction");

        // The third argument to dispatch should be the IArguments object for the action
        expect((<jasmine.Spy>dispatchImports.default).calls.argsFor(0)[2].length).toBe(1);
        expect((<jasmine.Spy>dispatchImports.default).calls.argsFor(0)[2][0]).toBe("testArgument");
    });

    it("sets the actionType as a property on the wrapped action", () => {
        let testFunction = () => {};
        let actionType = "testFunction";

        let wrappedAction = action(actionType)(testFunction);

        expect(getActionType(wrappedAction)).toBe(actionType);
    });

    it("passes on the original arguments", () => {
        let passedArguments: IArguments;

        let testFunction = function(a: number, b: number) {
            passedArguments = arguments;
        };

        testFunction = action("testFunction")(testFunction);
        testFunction(0, 1);

        expect(passedArguments[0]).toEqual(0);
        expect(passedArguments[1]).toEqual(1);
    });

    it("returns the original return value", () => {
        let originalReturnValue = new Promise<any>(() => {});

        let testFunction = function() {
            return originalReturnValue;
        };

        testFunction = action("testFunction")(testFunction);
        let returnValue = testFunction();

        expect(returnValue).toBe(originalReturnValue);
    });

    it("can decorate a class method", () => {
        let thisValue, inDispatchValue;
        class TestClass {
            @action("testMethod")
            testMethod() {
                thisValue = this;
                inDispatchValue = getGlobalContext().inDispatch;
            }
        }

        let testInstance = new TestClass();
        testInstance.testMethod();

        expect(thisValue).toBe(testInstance);
        expect(inDispatchValue).toBe(1);
    });

    it("sets the actionType as a property on the wrapped class method", () => {
        let actionType = "testFunction";

        class TestClass {
            @action(actionType)
            testMethod() {
            }
        }

        let testInstance = new TestClass();

        expect(getActionType(testInstance.testMethod)).toBe(actionType);
    });
});
