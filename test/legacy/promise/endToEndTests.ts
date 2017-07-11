import 'jasmine';
import { action, legacyApplyMiddleware, createStore } from '../../../src';
import { getCurrentAction, promiseMiddleware } from '../../../src/legacy/promise/promiseMiddleware';

describe("promiseMiddleware", () => {

    it("wraps callbacks in promises when applied", (done) => {
        // Arrange
        legacyApplyMiddleware(promiseMiddleware);
        let store = createStore("testStore", { testValue: null, currentAction: null });
        let newValue = {};

        // Act
        testAction(store, newValue).then(() => {
            // The new value should have been set
            expect(store.testValue).toBe(newValue);

            // The action name should indicate that it was a promise's "then" callback
            expect(store.currentAction).toBe("testAction => then");

            // At this point there should be no current action
            expect(getCurrentAction()).toBe(null);
            done();
        }).catch((error) => {
            // Assert that the action does not fail
            fail("Action failed with error: " + error);
            done();
        });
    });

    it("does not wrap callbacks in promises when not applied", (done) => {
        // Arrange
        legacyApplyMiddleware();
        let store = createStore("testStore", { testValue: null });
        let newValue = {};

        // Act
        testAction(store, newValue).then(() => {
            // Assert that the action fails
            fail("The action should fail.");
            done();
        }).catch((error) => {
            // Assert that the value was not set
            expect(store.testValue).not.toBe(newValue);
            done();
        });
    });

});


let testAction = action("testAction")(
    function testAction(store: any, newValue: any) {
        return Promise.resolve(newValue).then((value) => {
            store.testValue = value;
            store.currentAction = getCurrentAction();
        });
    });
