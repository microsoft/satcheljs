import 'jasmine';
import trace from '../lib/trace';
import {ActionContext} from 'satcheljs';

// Stub in console group methods for Node.js
if (typeof console.group != "function") {
    console.group = () => {};
    console.groupEnd = () => {};
}


describe("trace", () => {
    beforeEach(() => {
        spyOn(console, "group");
        spyOn(console, "groupEnd");
    });

    it("calls next with arguments", () => {
        let originalAction = () => {};
        let originalActionType = "testAction";
        let originalArguments = <IArguments>{};
        let originalActionContext = {a:1}
        let passedAction: any;
        let passedActionType: any;
        let passedArguments: IArguments;
        let passedActionContext: ActionContext;
        trace(
            (action, actionType, args, actionContext) => {
                passedAction = action;
                passedActionType = actionType;
                passedArguments = args;
                passedActionContext = actionContext;
            },
            originalAction,
            originalActionType,
            originalArguments,
            originalActionContext);

        expect(passedAction).toBe(originalAction);
        expect(passedActionType).toBe(originalActionType);
        expect(passedArguments).toBe(originalArguments);
        expect(passedActionContext).toBe(originalActionContext);
    });

    it("returns the return value from next", () => {
        let originalReturnValue = Promise.resolve({});

        let returnValue = trace(
            (action, actionType, args, actionContext) => {
                return originalReturnValue;
            },
            null,
            null,
            null,
            null);

        expect(returnValue).toBe(originalReturnValue);
    });

    it("logs actions", () => {
        trace(
            (action, actionType, args, actionContext) => { },
            null,
            "testAction",
            null,
            null);

        expect(console.group).toHaveBeenCalledTimes(1);
        expect((<jasmine.Spy>console.group).calls.argsFor(0)[0]).toMatch(/testAction/);
    });

    it("logs anonymous actions", () => {
        trace(
            (action, actionType, args, actionContext) => { },
            null,
            null,
            null,
            null);

        expect(console.group).toHaveBeenCalledTimes(1);
        expect((<jasmine.Spy>console.group).calls.argsFor(0)[0]).toMatch(/anonymous action/);
    });

    it("calls groupEnd even after an exception", () => {
        try {
            trace(
                (action, actionType, args, actionContext) => {
                    throw new Error();
                },
                null,
                "testAction",
                null,
                null);
        }
        catch (ex) { }

        expect(console.groupEnd).toHaveBeenCalledTimes(1);
    });
});
