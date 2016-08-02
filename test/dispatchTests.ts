import 'jasmine';
import {action as mobxAction, autorun, _} from 'mobx';

import rootStore from '../src/rootStore';
import initializeState from '../src/initializeState';
import dispatch from '../src/dispatch';
import * as applyMiddlewareImports from '../src/applyMiddleware';


var backupConsoleError = console.error;

describe("dispatch", () => {
    beforeEach(() => {
        _.resetGlobalState();
        initializeState({});
    });

    beforeAll(() => {
        // Some of these tests cause MobX to write to console.error, so we need to supress that output
        console.error = (message) => null;
    });

    afterAll(() => {
        console.error = backupConsoleError;
    });

    it("calls dispatchWithMiddleware with same arguments", () => {
        spyOn(applyMiddlewareImports, "dispatchWithMiddleware");
        let originalAction = () => {};
        let originalActionType = "testAction";
        let originalArguments: IArguments = <IArguments>{};
        dispatch(originalAction, originalActionType, originalArguments);
        expect(applyMiddlewareImports.dispatchWithMiddleware).toHaveBeenCalledWith(originalAction, originalActionType, originalArguments);
    });

    it("changing state outside of an action causes an exception", () => {
        initializeState({ foo: 1 });
        var delegate = () => { rootStore.set("foo", 2); };
        expect(delegate).toThrow();
    });

    it("changing state in a MobX action causes an exception", () => {
        initializeState({ foo: 1 });
        var delegate = mobxAction(() => { rootStore.set("foo", 2); });
        expect(delegate).toThrow();
    });

    it("executes middleware in the same transaction as the action", () => {
        initializeState({ foo: 0 });

        // Count how many times the autorun gets executed
        let count = 0;
        autorun(() => {
            rootStore.get("foo");
            count++;
        });

        // Autorun executes once when it is defined
        expect(count).toBe(1);

        // Change the state twice, once in middleware and once in the action
        applyMiddlewareImports.default(
            (next, action, actionType) => {
                rootStore.set("foo", 1);
                next(action, actionType, null);
            });

        dispatch(() => { rootStore.set("foo", 2); }, null, null);

        // Autorun should have executed exactly one more time
        expect(count).toBe(2);
    });
});
