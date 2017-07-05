import 'jasmine';
import Middleware from '../lib/interfaces/Middleware';
import { boundActionCreator } from '../lib/actionCreator';
import applyMiddleware from '../lib/applyMiddleware';
import { dispatch } from '../lib/dispatcher';
import { mutator } from '../lib/mutator';
import simpleAction from '../lib/simpleAction';
import createStore from '../lib/createStore';

describe("satcheljs", () => {

    it("mutators subscribe to actions", () => {
        let actualValue;

        // Create an action creator
        let testAction = boundActionCreator(
            "testAction",
            function testAction(value: string) {
                return {
                    value: value
                };
            });

        // Create a mutator that subscribes to it
        let onTestAction = mutator(
            testAction,
            function(actionMessage) {
                actualValue = actionMessage.value;
            });

        // Dispatch the action
        testAction("test");

        // Validate that the mutator was called with the dispatched action
        expect(actualValue).toBe("test");
    });

    it("simpleAction dispatches an action and subscribes to it", () => {
        // Arrange
        let arg1Value;
        let arg2Value;

        let testSimpleAction = simpleAction(
            "testSimpleAction",
            function testSimpleAction(arg1: string, arg2: number) {
                arg1Value = arg1;
                arg2Value = arg2;
            });

        // Act
        testSimpleAction("testValue", 2);

        // Assert
        expect(arg1Value).toBe("testValue");
        expect(arg2Value).toBe(2);
    });

    it("mutators can modify the store", () => {
        // Arrange
        let store = createStore("testStore", { testProperty: "testValue" });
        let modifyStore = boundActionCreator("modifyStore");

        let onModifyStore = mutator(
            modifyStore,
            (actionMessage) => { store.testProperty = "newValue"; });

        // Act
        modifyStore();

        // Assert
        expect(store.testProperty).toBe("newValue");
    });

    it("middleware gets called during dispatch", () => {
        // Arrange
        let actualValue;
        let expectedValue = { type: "testMiddleware" };

        applyMiddleware((next, actionMessage) => {
            actualValue = actionMessage;
            next(actionMessage);
        });

        // Act
        dispatch(expectedValue);

        // Assert
        expect(actualValue).toBe(expectedValue);
    });

});
