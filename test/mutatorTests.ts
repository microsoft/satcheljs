import 'jasmine';
import mutator from '../src/mutator';
import * as mobx from 'mobx';
import { createTestSatchel } from './utils/createTestSatchel';

describe('mutator', () => {
    it('throws if the action creator does not have an action ID', () => {
        // Arrange
        let actionCreator: any = {};

        // Act / Assert
        expect(() => {
            mutator(actionCreator, () => {});
        }).toThrow();
    });

    it('subscribes the target function to the action', () => {
        // Arrange
        const satchel = createTestSatchel();
        let actionId = 'testAction';
        let actionCreator: any = { __SATCHELJS_ACTION_ID: actionId };

        // Act
        const testMutator = mutator(actionCreator, () => {});
        satchel.register(testMutator);

        // Assert
        expect(satchel.__subscriptions[actionId]).toBeDefined();
    });

    it('wraps the subscribed callback in a MobX action', () => {
        // Arrange
        const satchel = createTestSatchel();
        let callback = () => {};
        let wrappedCallback = () => {};
        let actionCreator: any = { __SATCHELJS_ACTION_ID: 'testAction' };
        spyOn(mobx, 'action').and.returnValue(wrappedCallback);

        // Act
        const testMutator = mutator(actionCreator, callback);
        satchel.register(testMutator);

        // Assert
        expect(mobx.action).toHaveBeenCalled();
    });

    it('returns the target function', () => {
        // Arrange
        const satchel = createTestSatchel();
        let actionCreator: any = { __SATCHELJS_ACTION_ID: 'testAction' };
        let callback = () => {};

        // Act
        let returnValue = satchel.register(mutator(actionCreator, callback));

        // Assert
        expect(returnValue).toBe(callback);
    });

    it('sets the currentMutator to actionMessage type for the duration of the mutator callback', () => {
        // Arrange
        const satchel = createTestSatchel();
        let actionCreator: any = {
            __SATCHELJS_ACTION_ID: 'testAction',
            __SATCHELJS_ACTION_TYPE: 'testActionType',
        };
        let callback = () => {
            expect(satchel.__currentMutator).toBe('testActionType');
        };
        const testMutator = mutator(actionCreator, callback);

        // Act
        let subscribedCallback = (satchel.register as jasmine.Spy).calls.argsFor(0)[1];
        subscribedCallback(testMutator);

        // Assert
        expect(satchel.__currentMutator).toBe(null);
    });

    it('sets the currentMutator back to null if error is thrown', () => {
        // Arrange
        const satchel = createTestSatchel();
        let actionCreator: any = {
            __SATCHELJS_ACTION_ID: 'testAction',
            __SATCHELJS_ACTION_TYPE: 'testActionType',
        };
        let callback: any = () => {
            throw new Error('Error in Mutator');
        };
        const testMutator = mutator(actionCreator, callback);

        // Act
        let subscribedCallback = (satchel.register as jasmine.Spy).calls.argsFor(0)[1];
        try {
            subscribedCallback(testMutator);
        } catch {
            // no op
        }

        // Assert
        expect(satchel.__currentMutator).toBe(null);
    });
});
