import 'jasmine';
import { createTestSatchel } from './utils/createTestSatchel';
import * as privateUtils from '../src/privatePropertyUtils';

describe('dispatcher', () => {
    /*
    it('subscribe registers a callback for a given action', () => {
        // Arrange
        const satchel = createTestSatchel();
        const callback = () => ({});
        const action = satchel.actionCreator('TEST_ACTION', callback);

        // Act
        satchel.register(action);

        // Assert
        expect(mockGlobalContext.subscriptions[actionId]).toBeDefined();
        expect(mockGlobalContext.subscriptions[actionId].length).toBe(1);
        expect(mockGlobalContext.subscriptions[actionId][0]).toBe(callback);
    });

    it('subscribe can register multiple callbacks', () => {
        // Arrange
        let actionId = 'testActionId';
        let callback0 = () => {};
        let callback1 = () => {};

        // Act
        dispatcher.subscribe(actionId, callback0);
        dispatcher.subscribe(actionId, callback1);

        // Assert
        expect(mockGlobalContext.subscriptions[actionId]).toEqual([callback0, callback1]);
    });
    */

    it('dispatch calls dispatchWithMiddleware', () => {
        // Arrange
        let actionMessage = {};
        const satchel = createTestSatchel();

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
