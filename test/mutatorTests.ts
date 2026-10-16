import 'jasmine';
import * as mobx from 'mobx';
import { createActionCreatorFactory } from '../src/actionCreator';
import { createSatchel } from '../src/createSatchel';
import createSatchelState from '../src/createSatchelState';
import mutator from '../src/mutator';
import { getPrivateActionId } from '../src/privatePropertyUtils';
import { createRegister } from '../src/register';

describe('mutator', () => {
    it('returns a object describing the mutator', () => {
        // Arrange
        const callback = () => {};
        const actionCreator: any = () => {};

        // Act
        const testMutator = mutator(actionCreator, callback);

        // Assert
        expect(testMutator).toEqual({
            type: 'mutator',
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
            register(mutator(actionCreator, () => {}));
        }).toThrow();
    });

    it('subscribes the target function to the action', () => {
        // Arrange
        const state = createSatchelState();
        const actionCreator = createActionCreatorFactory(state)('testAction');

        // Act
        const testMutator = mutator(actionCreator, () => {});
        createRegister(state)(testMutator);

        // Assert
        expect(state.subscriptions.get(getPrivateActionId(actionCreator)).length).toBe(1);
    });

    it('wraps the subscribed callback in a MobX action', () => {
        // Arrange
        const state = createSatchelState();
        const actionCreator = createActionCreatorFactory(state)('testAction');
        let callback = () => {};
        let wrappedCallback = () => {};
        spyOn(mobx, 'action').and.returnValue(wrappedCallback);

        // Act
        const testMutator = mutator(actionCreator, callback);
        createRegister(state)(testMutator);

        // Assert
        expect(mobx.action).toHaveBeenCalled();
        expect(state.subscriptions.get(getPrivateActionId(actionCreator))[0]).toBe(wrappedCallback);
    });

    it('sets the currentMutator to actionMessage type for the duration of the mutator callback', () => {
        // Arrange
        const satchel = createSatchel();
        const testAction = satchel.action('testActionType');
        let currentMutatorDuringCallback: string | null = null;
        const testMutator = mutator(testAction, () => {
            currentMutatorDuringCallback = satchel.getCurrentMutator();
        });
        satchel.register(testMutator);

        // Act
        testAction();

        // Assert
        expect(currentMutatorDuringCallback).toBe('testActionType');
        expect(satchel.getCurrentMutator()).toBe(null);
    });

    it('sets the currentMutator back to null if error is thrown', () => {
        // Arrange
        const satchel = createSatchel();
        const testAction = satchel.action('testActionType');
        const testMutator = mutator(testAction, (): void => {
            throw new Error('Error in Mutator');
        });
        satchel.register(testMutator);

        // Act / Assert
        expect(() => testAction()).toThrowError('Error in Mutator');
        expect(satchel.getCurrentMutator()).toBe(null);
    });
});
