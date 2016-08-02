import 'jasmine';

import { default as applyMiddleware, dispatchWithMiddleware } from '../src/applyMiddleware';
import ActionFunction from '../src/ActionFunction';


describe("applyMiddleware", () => {
    beforeEach(() => {
        applyMiddleware();
    });

    it("Calls middleware during dispatchWithMiddleware", () => {
        let actionCalled = false;
        let middlewareCalled = false;

        applyMiddleware(
            (next, action, actionType) => {
                middlewareCalled = true;
                next(action, actionType, null);
            });

        dispatchWithMiddleware(() => { actionCalled = true; }, null, null);
        expect(actionCalled).toBeTruthy();
        expect(middlewareCalled).toBeTruthy();
    });

    it("Calls middleware in order", () => {
        var middleware0Called = false;
        var middleware1Called = false;

        applyMiddleware(
            (next, action, actionType) => {
                expect(middleware1Called).toBeFalsy();
                middleware0Called = true;
                next(action, actionType, null);
            },
            (next, action, actionType) => {
                expect(middleware0Called).toBeTruthy();
                middleware1Called = true;
                next(action, actionType, null);
            });

        dispatchWithMiddleware(() => { }, null, null);
        expect(middleware1Called).toBeTruthy();
    });

    it("Passes action parameters to middleware", () => {
        let originalAction = () => {};
        let originalActionType = "testAction";
        let originalArguments = <IArguments>{};

        var passedAction: ActionFunction;
        var passedActionType: string;
        var passedArguments: IArguments;

        applyMiddleware(
            (next, action, actionType, args) => {
                passedAction = action;
                passedActionType = actionType;
                passedArguments = args;
            });

        dispatchWithMiddleware(originalAction, originalActionType, originalArguments);
        expect(passedAction).toBe(originalAction);
        expect(passedActionType).toBe(originalActionType);
        expect(passedArguments).toBe(originalArguments);
    });

    it("Returns the action return value to middleware", () => {
        let originalReturnValue = Promise.resolve({});
        let originalAction = () => { return originalReturnValue; }
        let receivedReturnValue: Promise<any> | void;

        applyMiddleware(
            (next, action, actionType, args) => {
                receivedReturnValue = next(action, actionType, args)
            });

        dispatchWithMiddleware(originalAction, null, null);
        expect(receivedReturnValue).toBe(originalReturnValue);
    });
});
