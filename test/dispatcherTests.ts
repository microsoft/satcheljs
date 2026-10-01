import 'jasmine';
import { createTestSatchel } from './utils/createTestSatchel';
import * as privateUtils from '../src/privatePropertyUtils';

describe('dispatch', () => {
    it('dispatch calls dispatchWithMiddleware', () => {
        // Arrange
        let actionMessage = {};
        const satchel = createTestSatchel();
        spyOn(satchel, '__dispatchWithMiddleware');

        // Act
        satchel.dispatch(actionMessage);

        // Assert
        expect(satchel.__dispatchWithMiddleware).toHaveBeenCalledWith(actionMessage);
    });

    it('dispatch throws if called within a mutator', () => {
        // Arrange
        const satchel = createTestSatchel();
        satchel.__currentMutator = 'SomeAction';

        // Act / Assert
        expect(() => {
            satchel.dispatch({});
        }).toThrow();
    });

    it('dispatch throws if the action message was created by a different satchel', () => {
        // Arrange
        const satchel1 = createTestSatchel();
        const satchel2 = createTestSatchel();
        const actionMessage = satchel1.actionCreator('testAction')();
        spyOn(satchel2, '__dispatchWithMiddleware');

        // Act / Assert
        expect(() => satchel2.dispatch(actionMessage)).toThrowError(
            'Action (testAction) was created by a different satchel instance.'
        );
        expect(satchel2.__dispatchWithMiddleware).not.toHaveBeenCalled();
    });

    it('finalDispatch calls all subscribers for a given action', () => {
        // Arrange
        const satchel = createTestSatchel();
        let actionMessage = {};
        let actionId = 'testActionId';
        spyOn(privateUtils, 'getPrivateActionId').and.returnValue(actionId);

        let callback0 = jasmine.createSpy('callback0');
        let callback1 = jasmine.createSpy('callback1');
        satchel.__subscriptions[actionId] = [callback0, callback1];

        // Act
        satchel.__finalDispatch(actionMessage);

        // Assert
        expect(callback0).toHaveBeenCalledWith(actionMessage);
        expect(callback1).toHaveBeenCalledWith(actionMessage);
    });

    it('finalDispatch handles the case where there are no subscribers', () => {
        // Arrange
        const satchel = createTestSatchel();
        spyOn(privateUtils, 'getPrivateActionId').and.returnValue('testActionId');

        // Act / Assert
        expect(() => {
            satchel.__finalDispatch({});
        }).not.toThrow();
    });

    it('if one subscriber returns a Promise, finalDispatch returns it', () => {
        // Arrange
        const satchel = createTestSatchel();
        let actionId = 'testActionId';
        spyOn(privateUtils, 'getPrivateActionId').and.returnValue(actionId);

        let promise = Promise.resolve();
        let callback = () => promise;
        satchel.__subscriptions[actionId] = [callback];

        // Act
        let returnValue = satchel.__finalDispatch({});

        // Assert
        expect(returnValue).toBe(promise);
    });

    it('if multiple subscribers returns Promises, finalDispatch returns an aggregate Promise', () => {
        // Arrange
        const satchel = createTestSatchel();
        let actionId = 'testActionId';
        spyOn(privateUtils, 'getPrivateActionId').and.returnValue(actionId);

        let promise1 = Promise.resolve();
        let callback1 = () => promise1;
        let promise2 = Promise.resolve();
        let callback2 = () => promise2;
        satchel.__subscriptions[actionId] = [callback1, callback2];

        let aggregatePromise = Promise.resolve();
        spyOn(Promise, 'all').and.returnValue(aggregatePromise);

        // Act
        let returnValue = satchel.__finalDispatch({});

        // Assert
        expect(Promise.all).toHaveBeenCalledWith([promise1, promise2]);
        expect(returnValue).toBe(aggregatePromise);
    });
});
