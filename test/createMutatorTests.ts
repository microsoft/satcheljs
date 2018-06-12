import { actionCreator } from '../src/index';
import { createMutator } from '../src/createMutator';

describe('createMutator', () => {
    const testAction = actionCreator('testAction');
    const actionToDispatch = testAction();

    it('returns a mutator with the given initial value', () => {
        // Arrange
        const initialValue = {};

        // Act
        const mutator = createMutator(initialValue);

        // Assert
        expect(mutator.getInitialValue()).toBe(initialValue);
    });

    it('can modify the state when handling an action', () => {
        // Arrange
        const state = { a: 1 };
        const mutator = createMutator(state);
        const replaceState = jasmine.createSpy('replaceState');

        mutator.handles(testAction, (state, actionMessage) => {
            state.a = 2;
        });

        // Act
        mutator.handleAction(state, actionToDispatch, replaceState);

        // Assert
        expect(state).toEqual({ a: 2 });
    });

    it('can replace the state when handling an action', () => {
        // Arrange
        const state = { a: 1 };
        const mutator = createMutator(state);
        const replaceState = jasmine.createSpy('replaceState');

        mutator.handles(testAction, (state, actionMessage) => {
            return null;
        });

        // Act
        mutator.handleAction(state, actionToDispatch, replaceState);

        // Assert
        expect(replaceState).toHaveBeenCalledWith(null);
    });
});
