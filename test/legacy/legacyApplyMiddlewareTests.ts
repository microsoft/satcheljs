import 'jasmine';

import { default as legacyApplyMiddleware, dispatchWithMiddleware } from '../../src/legacy/legacyApplyMiddleware';
import ActionFunction from '../../src/legacy/ActionFunction';
import ActionContext from '../../src/legacy/ActionContext';

describe("legacyApplyMiddleware", () => {
    beforeEach(() => {
        legacyApplyMiddleware();
    });

    it("Calls middleware during dispatchWithMiddleware", () => {
        let actionCalled = false;
        let middlewareCalled = false;

        legacyApplyMiddleware(
            (next, action, actionType, actionContext) => {
                middlewareCalled = true;
                next(action, actionType, null, actionContext);
            });

        dispatchWithMiddleware(() => { actionCalled = true; }, null, null, null);
        expect(actionCalled).toBeTruthy();
        expect(middlewareCalled).toBeTruthy();
    });

    it("Calls middleware in order", () => {
        var middleware0Called = false;
        var middleware1Called = false;

        legacyApplyMiddleware(
            (next, action, actionType, actionContext) => {
                expect(middleware1Called).toBeFalsy();
                middleware0Called = true;
                next(action, actionType, null, actionContext);
            },
            (next, action, actionType, actionContext) => {
                expect(middleware0Called).toBeTruthy();
                middleware1Called = true;
                next(action, actionType, null, actionContext);
            });

        dispatchWithMiddleware(() => { }, null, null, null);
        expect(middleware1Called).toBeTruthy();
    });

    it("Passes action parameters to middleware", () => {
        let originalAction = () => {};
        let originalActionType = "testAction";
        let originalArguments = <IArguments>{};
        let originalOptions = { a: 1 };

        var passedAction: ActionFunction;
        var passedActionType: string;
        var passedArguments: IArguments;
        var passedOptions: ActionContext;

        legacyApplyMiddleware(
            (next, action, actionType, args, actionContext) => {
                passedAction = action;
                passedActionType = actionType;
                passedArguments = args;
                passedOptions = actionContext;
            });

        dispatchWithMiddleware(originalAction, originalActionType, originalArguments, originalOptions);
        expect(passedAction).toBe(originalAction);
        expect(passedActionType).toBe(originalActionType);
        expect(passedArguments).toBe(originalArguments);
        expect(passedOptions).toBe(originalOptions);
    });

    it("Returns the action return value to middleware", () => {
        let originalReturnValue = Promise.resolve({});
        let originalAction = () => { return originalReturnValue; };
        let receivedReturnValue: Promise<any> | void;

        legacyApplyMiddleware(
            (next, action, actionType, args, actionContext) => {
                receivedReturnValue = next(action, actionType, args, actionContext);
            });

        dispatchWithMiddleware(originalAction, null, null, null);
        expect(receivedReturnValue).toBe(originalReturnValue);
    });
});
