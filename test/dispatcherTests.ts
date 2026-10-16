import 'jasmine';
import { createSatchel } from '../src/createSatchel';
import createSatchelState from '../src/createSatchelState';
import { createDispatch, createFinalDispatch } from '../src/dispatcher';
import { setPrivateActionId } from '../src/privatePropertyUtils';

function createTestActionMessage(actionId: string) {
    const actionMessage = {};
    setPrivateActionId(actionMessage, actionId);
    return actionMessage;
}

describe('dispatch', () => {
    it('dispatch passes the action message through the middleware', () => {
        // Arrange
        let actionMessage = {};
        const middleware = jasmine.createSpy('middleware');
        const dispatch = createDispatch(createSatchelState(), [middleware]);

        // Act
        dispatch(actionMessage);

        // Assert
        expect(middleware).toHaveBeenCalledWith(jasmine.any(Function), actionMessage);
    });

    it('dispatch throws if called within a mutator', () => {
        // Arrange
        const state = createSatchelState();
        const dispatch = createDispatch(state, []);
        state.currentMutator = 'SomeAction';

        // Act / Assert
        expect(() => {
            dispatch({});
        }).toThrow();
    });

    it('dispatch throws if the action message was created by a different satchel', () => {
        // Arrange
        const actionMessage = createSatchel().actionCreator('testAction')();
        const middleware = jasmine.createSpy('middleware');
        const dispatch = createDispatch(createSatchelState(), [middleware]);

        // Act / Assert
        expect(() => dispatch(actionMessage)).toThrowError(
            'Action (testAction) was created by a different satchel instance.'
        );
        expect(middleware).not.toHaveBeenCalled();
    });

    it('finalDispatch calls all subscribers for a given action', () => {
        // Arrange
        const state = createSatchelState();
        let actionId = 'testActionId';
        let actionMessage = createTestActionMessage(actionId);

        let callback0 = jasmine.createSpy('callback0');
        let callback1 = jasmine.createSpy('callback1');
        state.subscriptions.set(actionId, [callback0, callback1]);

        // Act
        createFinalDispatch(state)(actionMessage);

        // Assert
        expect(callback0).toHaveBeenCalledWith(actionMessage);
        expect(callback1).toHaveBeenCalledWith(actionMessage);
    });

    it('finalDispatch handles the case where there are no subscribers', () => {
        // Arrange
        const finalDispatch = createFinalDispatch(createSatchelState());

        // Act / Assert
        expect(() => {
            finalDispatch({});
            finalDispatch(createTestActionMessage('testActionId'));
        }).not.toThrow();
    });

    it('if one subscriber returns a Promise, finalDispatch returns it', () => {
        // Arrange
        const state = createSatchelState();
        let actionId = 'testActionId';

        let promise = Promise.resolve();
        let callback = () => promise;
        state.subscriptions.set(actionId, [callback]);

        // Act
        let returnValue = createFinalDispatch(state)(createTestActionMessage(actionId));

        // Assert
        expect(returnValue).toBe(promise);
    });

    it('if multiple subscribers returns Promises, finalDispatch returns an aggregate Promise', () => {
        // Arrange
        const state = createSatchelState();
        let actionId = 'testActionId';

        let promise1 = Promise.resolve();
        let callback1 = () => promise1;
        let promise2 = Promise.resolve();
        let callback2 = () => promise2;
        state.subscriptions.set(actionId, [callback1, callback2]);

        let aggregatePromise = Promise.resolve();
        spyOn(Promise, 'all').and.returnValue(aggregatePromise);

        // Act
        let returnValue = createFinalDispatch(state)(createTestActionMessage(actionId));

        // Assert
        expect(Promise.all).toHaveBeenCalledWith([promise1, promise2]);
        expect(returnValue).toBe(aggregatePromise);
    });
});
