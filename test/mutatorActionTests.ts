import 'jasmine';
import { createActionFactory } from '../src/actionCreator';
import createSatchelState from '../src/createSatchelState';
import * as mutator from '../src/mutator';
import { createMutatorActionFactory } from '../src/mutatorAction';

describe('mutatorAction', () => {
    let actionSpy: jasmine.Spy;
    let registerSpy: jasmine.Spy;
    let decoratorSpy: jasmine.Spy;
    let mutatorAction: ReturnType<typeof createMutatorActionFactory>;

    beforeEach(() => {
        const action = createActionFactory(createSatchelState(), () => {});
        actionSpy = jasmine.createSpy('action').and.callFake(action);
        registerSpy = jasmine.createSpy('register');
        decoratorSpy = spyOn(mutator, 'default').and.callThrough();
        mutatorAction = createMutatorActionFactory(actionSpy as any, registerSpy);
    });

    it('creates and returns a bound action creator', () => {
        // Arrange
        let actionId = 'testSubscriber';

        // Act
        let returnValue = mutatorAction(actionId, () => {});

        // Assert
        expect(actionSpy).toHaveBeenCalled();
        expect(actionSpy.calls.argsFor(0)[0]).toBe(actionId);
        expect(returnValue).toBe(actionSpy.calls.first().returnValue);
    });

    it('includes arguments in the action message', () => {
        // Act
        let returnValue: Function = mutatorAction('testSubscriber', () => {});
        let createdAction = returnValue(1, 2, 3);

        // Assert
        expect(Array.from(createdAction.args)).toEqual([1, 2, 3]);
    });

    it('subscribes a callback to the action', () => {
        // Act
        mutatorAction('testSubscriber', () => {});

        // Assert
        expect(decoratorSpy).toHaveBeenCalled();
        expect(decoratorSpy.calls.argsFor(0)[0]).toBe(actionSpy.calls.first().returnValue);
        expect(registerSpy).toHaveBeenCalledWith(decoratorSpy.calls.first().returnValue);
    });

    it('passes arguments to the callback', () => {
        // Arrange
        let callback = jasmine.createSpy('callback');
        let actionMessage = { args: [1, 2, 3] };

        // Act
        mutatorAction('testSubscriber', callback);
        let decoratorCallback = decoratorSpy.calls.argsFor(0)[1];
        decoratorCallback(actionMessage);

        // Assert
        expect(callback).toHaveBeenCalledWith(1, 2, 3);
    });
});
