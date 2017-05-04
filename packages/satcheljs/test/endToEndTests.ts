import 'jasmine';
import actionDispatcher from '../lib/actionDispatcher';
import mutator from '../lib/mutator';


describe("satcheljs", () => {

    it("mutators subscribe to actions", () => {
        let fooValue = null

        // Create an action dispatcher
        let testAction = actionDispatcher("testAction")(
            function testAction(foo: string) {
                return {
                    type: "testAction",
                    foo: foo
                };
            });

        // Create a mutator that subscribes to it
        mutator(testAction)(
            function(actionMessage) {
                fooValue = actionMessage.foo;
            });

        // Dispatch the action
        testAction("test");

        // Validate that the mutator was called with the dispatched action
        expect(fooValue).toBe("test");
    });

});
