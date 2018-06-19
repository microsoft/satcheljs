import { actionCreator } from '../src/index';
import Mutator from '../src/Mutator';

describe('Mutator', () => {
    const testAction = actionCreator('testAction');
    const actionToDispatch = testAction();

    it('can modify the state when handling an action', () => {
        // Arrange
        const state = { a: 1 };
        const mutator = new Mutator(state);
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
        const mutator = new Mutator(state);
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
