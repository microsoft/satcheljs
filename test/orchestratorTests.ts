import 'jasmine';
import orchestrator from '../src/orchestrator';
import { getPrivateSubscriberRegistered } from '../src/privatePropertyUtils';
import { createTestSatchel } from './utils/createTestSatchel';

describe('orchestrator', () => {
    it('returns a object describing the orchestrator', () => {
        // Arrange
        const callback = () => {};
        const actionId = 'testAction';
        const actionCreator: any = { __SATCHELJS_ACTION_ID: actionId };

        // Act
        const testOrchestator = orchestrator(actionCreator, callback);

        // Assert
        expect(testOrchestator.type).toBe('orchestrator');
        expect(testOrchestator.actionCreator).toBe(actionCreator);
        expect(testOrchestator.target).toBe(callback);
        expect(getPrivateSubscriberRegistered(testOrchestator)).toBe(false);
    });
    it('throws if the action creator does not have an action ID', () => {
        // Arrange
        const satchel = createTestSatchel();
        let actionCreator: any = {};

        // Act / Assert
        expect(() => {
            satchel.register(orchestrator(actionCreator, () => {}));
        }).toThrow();
    });

    it('subscribes the target function to the action', () => {
        // Arrange
        const satchel = createTestSatchel();
        let callback = () => {};
        let actionId = 'testAction';
        let actionCreator: any = { __SATCHELJS_ACTION_ID: actionId };

        // Act
        const testOrchestator = orchestrator(actionCreator, callback);
        satchel.register(testOrchestator);

        // Assert
        expect(satchel.__subscriptions[actionId]).toBeDefined();
        expect(satchel.__subscriptions[actionId][0]).toBe(callback);
        expect(getPrivateSubscriberRegistered(testOrchestator)).toBe(true);
    });

    it('returns the target function', () => {
        // Arrange
        let actionCreator: any = { __SATCHELJS_ACTION_ID: 'testAction' };
        let callback = () => {};
        const satchel = createTestSatchel();
        const testOrchestator = orchestrator(actionCreator, callback);

        // Act
        const returnValue = satchel.register(testOrchestator);

        // Assert
        expect(returnValue).toBe(callback);
    });
});
