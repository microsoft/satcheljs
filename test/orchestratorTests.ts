import 'jasmine';
import { createActionCreatorFactory } from '../src/actionCreator';
import createSatchelState from '../src/createSatchelState';
import orchestrator from '../src/orchestrator';
import { getPrivateActionId } from '../src/privatePropertyUtils';
import { createRegister } from '../src/register';

describe('orchestrator', () => {
    it('returns a object describing the orchestrator', () => {
        // Arrange
        const callback = () => {};
        const actionCreator: any = () => {};

        // Act
        const testOrchestator = orchestrator(actionCreator, callback);

        // Assert
        expect(testOrchestator).toEqual({
            type: 'orchestrator',
            actionCreator,
            target: callback,
        });
    });

    it('throws if the action creator does not have an action ID', () => {
        // Arrange
        const register = createRegister(createSatchelState());
        let actionCreator: any = {};

        // Act / Assert
        expect(() => {
            register(orchestrator(actionCreator, () => {}));
        }).toThrow();
    });

    it('subscribes the target function to the action', () => {
        // Arrange
        const state = createSatchelState();
        const actionCreator = createActionCreatorFactory(state)('testAction');
        let callback = () => {};

        // Act
        const testOrchestator = orchestrator(actionCreator, callback);
        createRegister(state)(testOrchestator);

        // Assert
        const subscribers = state.subscriptions.get(getPrivateActionId(actionCreator));
        expect(subscribers).toEqual([callback]);
        expect(state.registeredSubscribers.has(testOrchestator)).toBe(true);
    });
});
