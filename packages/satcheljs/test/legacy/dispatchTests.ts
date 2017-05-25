import 'jasmine';
import { action as mobxAction, autorun, _ } from 'mobx';

import rootStore from '../../lib/legacy/rootStore';
import initializeState from '../../lib/legacy/initializeState';
import dispatch from '../../lib/legacy/dispatch';
import * as applyMiddlewareImports from '../../lib/legacy/applyMiddleware';
import { __resetGlobalContext } from '../../lib/legacy/globalContext'
import { getGlobalContext } from '../../lib/legacy/globalContext';

var backupConsoleError = console.error;

describe("dispatch", () => {
    beforeEach(() => {
        _.resetGlobalState();
        initializeState({});
        __resetGlobalContext();
    });

    beforeAll(() => {
        // Some of these tests cause MobX to write to console.error, so we need to supress that output
        console.error = (message: any): void => null;
    });

    afterAll(() => {
        console.error = backupConsoleError;
    });

    it("calls dispatchWithMiddleware with same arguments", () => {
        spyOn(applyMiddlewareImports, "dispatchWithMiddleware");
        let originalAction = () => { };
        let originalActionType = "testAction";
        let originalArguments: IArguments = <IArguments>{};
        let options = { a: 1 };
        dispatch(originalAction, originalActionType, originalArguments, options);
        expect(applyMiddlewareImports.dispatchWithMiddleware).toHaveBeenCalledWith(originalAction, originalActionType, originalArguments, options);
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
            (next, action, actionType, actionContext) => {
                rootStore.set("foo", 1);
                next(action, actionType, null, actionContext);
            });

        dispatch(() => { rootStore.set("foo", 2); }, null, null, null);

        // Autorun should have executed exactly one more time
        expect(count).toBe(2);
    });
});