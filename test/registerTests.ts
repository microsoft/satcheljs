import 'jasmine';
import { createActionCreatorFactory } from '../src/actionCreator';
import createSatchelState from '../src/createSatchelState';
import mutator from '../src/mutator';
import orchestrator from '../src/orchestrator';
import { getPrivateActionId } from '../src/privatePropertyUtils';
import { createRegister } from '../src/register';

describe('register', () => {
    it('registers a callback for a given action', () => {
        // Arrange
        const state = createSatchelState();
        const testAction = createActionCreatorFactory(state)('testAction');
        const callback = () => {};

        // Act
        createRegister(state)(orchestrator(testAction, callback));

        // Assert
        expect(state.subscriptions.get(getPrivateActionId(testAction))).toEqual([callback]);
    });

    it('can register multiple callbacks for the same action', () => {
        // Arrange
        const state = createSatchelState();
        const register = createRegister(state);
        const testAction = createActionCreatorFactory(state)('testAction');
        const callback0 = () => {};
        const callback1 = () => {};

        // Act
        register(orchestrator(testAction, callback0));
        register(orchestrator(testAction, callback1));

        // Assert
        expect(state.subscriptions.get(getPrivateActionId(testAction))).toEqual([
            callback0,
            callback1,
        ]);
    });

    it('registers the same subscriber only once', () => {
        // Arrange
        const state = createSatchelState();
        const register = createRegister(state);
        const testAction = createActionCreatorFactory(state)('testAction');
        const testMutator = mutator(testAction, () => {});

        // Act
        register(testMutator);
        register(testMutator);

        // Assert
        expect(state.subscriptions.get(getPrivateActionId(testAction)).length).toBe(1);
    });

    it('throws if the action creator was created by a different satchel', () => {
        // Arrange
        const state1 = createSatchelState();
        const state2 = createSatchelState();
        const testAction = createActionCreatorFactory(state1)('testAction');

        // Act / Assert
        expect(() => createRegister(state2)(orchestrator(testAction, () => {}))).toThrowError(
            'Action (testAction) was created by a different satchel instance.'
        );
        expect(state2.subscriptions.size).toBe(0);
        expect(state1.subscriptions.get(getPrivateActionId(testAction))).toEqual([]);
    });
});
