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
            (next, action, actionType, middleWareOptions) => {
                middlewareCalled = true;
                next(action, actionType, null, middleWareOptions);
            });

        dispatchWithMiddleware(() => { actionCalled = true; }, null, null, null);
        expect(actionCalled).toBeTruthy();
        expect(middlewareCalled).toBeTruthy();
    });

    it("Calls middleware in order", () => {
        var middleware0Called = false;
        var middleware1Called = false;

        applyMiddleware(
            (next, action, actionType, middleWareOptions) => {
                expect(middleware1Called).toBeFalsy();
                middleware0Called = true;
                next(action, actionType, null, middleWareOptions);
            },
            (next, action, actionType, middleWareOptions) => {
                expect(middleware0Called).toBeTruthy();
                middleware1Called = true;
                next(action, actionType, null, middleWareOptions);
            });

        dispatchWithMiddleware(() => { }, null, null, null);
        expect(middleware1Called).toBeTruthy();
    });

    it("Passes action parameters to middleware", () => {
        let originalAction = () => {};
        let originalActionType = "testAction";
        let originalArguments = <IArguments>{};
        let originalOptions = {a:1};

        var passedAction: ActionFunction;
        var passedActionType: string;
        var passedArguments: IArguments;
        var passedOptions: { [key: string]: any };

        applyMiddleware(
            (next, action, actionType, args, middleWareOptions) => {
                passedAction = action;
                passedActionType = actionType;
                passedArguments = args;
                passedOptions = middleWareOptions;
            });

        dispatchWithMiddleware(originalAction, originalActionType, originalArguments, originalOptions);
        expect(passedAction).toBe(originalAction);
        expect(passedActionType).toBe(originalActionType);
        expect(passedArguments).toBe(originalArguments);
        expect(passedOptions).toBe(originalOptions);
    });

    it("Returns the action return value to middleware", () => {
        let originalReturnValue = Promise.resolve({});
        let originalAction = () => { return originalReturnValue; }
        let receivedReturnValue: Promise<any> | void;

        applyMiddleware(
            (next, action, actionType, args, middleWareOptions) => {
                receivedReturnValue = next(action, actionType, args, middleWareOptions)
            });

        dispatchWithMiddleware(originalAction, null, null, null);
        expect(receivedReturnValue).toBe(originalReturnValue);
    });
});
