import 'jasmine';
import trace from '../src/trace';
import { ActionContext } from 'satcheljs';

describe("trace", () => {
    beforeEach(() => {
        spyOn(console, "log");
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

        expect(console.log).toHaveBeenCalledTimes(1);
        expect((<jasmine.Spy>console.log).calls.argsFor(0)[0]).toMatch(/testAction/);
    });

    it("logs anonymous actions", () => {
        trace(
            (action, actionType, args, actionContext) => { },
            null,
            null,
            null,
            null);

        expect(console.log).toHaveBeenCalledTimes(1);
        expect((<jasmine.Spy>console.log).calls.argsFor(0)[0]).toMatch(/anonymous action/);
    });

    it("indents nested actions", () => {
        let next = () => {
            trace(() => {}, null, "innerAction", null, null);
        };

        trace(next, null, "outerAction", null, null);

        let logCalls = (<jasmine.Spy>console.log).calls;
        expect(logCalls.argsFor(0)[0]).toBe("Executing action: outerAction");
        expect(logCalls.argsFor(1)[0]).toMatch("  Executing action: innerAction");
    });

    it("indents correctly after an exception", () => {
        let next = () => {
            trace(() => { throw new Error(); }, null, "action2", null, null);
        };

        try { trace(next, null, "action1", null, null); }
        catch (ex) { }

        trace(() => {}, null, "action3", null, null);

        expect((<jasmine.Spy>console.log).calls.argsFor(2)[0]).toBe("Executing action: action3");
    });
});
