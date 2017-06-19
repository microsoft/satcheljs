import 'jasmine';
import { boundActionCreator } from '../lib/actionCreator';
import { mutator, registerMutators } from '../lib/mutator';
import simpleAction from '../lib/simpleAction';
import createStore from '../lib/createStore';

describe("satcheljs", () => {

    it("mutators subscribe to actions", () => {
        let fooValue = null

        // Create an action dispatcher
        let testAction = boundActionCreator(
            "testAction",
            function testAction(foo: string) {
                return {
                    foo: foo
                };
            });

        // Create a mutator that subscribes to it
        let onTestAction = mutator(
            testAction,
            function(actionMessage) {
                fooValue = actionMessage.foo;
            });

        // Register the mutator
        registerMutators(onTestAction);

        // Dispatch the action
        testAction("test");

        // Validate that the mutator was called with the dispatched action
        expect(fooValue).toBe("test");
    });

    it("simpleAction dispatches an action and subscribes to it", () => {
        // Arrange
        let arg1Value = null;
        let arg2Value = null;

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

        registerMutators(onModifyStore);

        // Act
        modifyStore();

        // Assert
        expect(store.testProperty).toBe("newValue");
    });

});
