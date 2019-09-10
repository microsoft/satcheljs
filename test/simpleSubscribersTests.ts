import 'jasmine';
import { createSimpleSubscriber, mutatorAction } from '../src/simpleSubscribers';
import { __resetGlobalContext } from '../src/globalContext';
import * as actionCreator from '../src/actionCreator';

describe('simpleSubscribers', () => {
    let actionCreatorSpy: jasmine.Spy;
    let decoratorSpy: jasmine.Spy;
    let simpleSubscriber: Function;

    beforeEach(() => {
        __resetGlobalContext();
        actionCreatorSpy = spyOn(actionCreator, 'action').and.callThrough();
        decoratorSpy = jasmine.createSpy('decoratorSpy');
        simpleSubscriber = createSimpleSubscriber(decoratorSpy);
    });

    it('creates and returns a bound action creator', () => {
        // Arrange
        let actionId = 'testSubscriber';

        // Act
        let returnValue = simpleSubscriber(actionId, () => {});

        // Assert
        expect(actionCreatorSpy).toHaveBeenCalled();
        expect(actionCreatorSpy.calls.argsFor(0)[0]).toBe(actionId);
        expect(returnValue).toBe(actionCreatorSpy.calls.first().returnValue);
    });

    it('includes arguments in the action message', () => {
        // Act
        let returnValue: Function = simpleSubscriber('testSubscriber', () => {});
        let createdAction = returnValue(1, 2, 3);

        // Assert
        expect(Array.from(createdAction.args)).toEqual([1, 2, 3]);
    });

    it('subscribes a callback to the action', () => {
        // Act
        simpleSubscriber('testSubscriber', () => {});

        // Assert
        expect(decoratorSpy).toHaveBeenCalled();
        expect(decoratorSpy.calls.argsFor(0)[0]).toBe(actionCreatorSpy.calls.first().returnValue);
    });

    it('passes arguments to the callback', () => {
        // Arrange
        let callback = jasmine.createSpy('callback');
        let actionMessage = { args: [1, 2, 3] };

        // Act
        simpleSubscriber('testSubscriber', callback);
        let decoratorCallback = decoratorSpy.calls.argsFor(0)[1];
        decoratorCallback(actionMessage);

        // Assert
        expect(callback).toHaveBeenCalledWith(1, 2, 3);
    });

    it('throws if the target function is async', () => {
        // Arrange
        let callback = async () => {};
        let actionCreator = mutatorAction('testMutator', callback);

        // Act / Assert
        expect(actionCreator).toThrow();
    });
});
