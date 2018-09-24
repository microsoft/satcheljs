import { actionCreator } from '../src/index';
import CombinedMutator from '../src/CombinedMutator';
import createMutator from '../src/createMutator';

describe('CombinedMutator', () => {
    const mutatorA = createMutator('a');
    const mutatorB = createMutator('b');

    it('combines the initial values of its child mutators', () => {
        // Act
        let combinedMutator = new CombinedMutator({
            A: mutatorA,
            B: mutatorB,
        });

        // Assert
        expect(combinedMutator.getInitialValue()).toEqual({ A: 'a', B: 'b' });
    });

    it('dispatches actions to each child mutator', () => {
        // Arrange
        const actionMessage = {};
        const spyA = spyOn(mutatorA, 'handleAction');
        const spyB = spyOn(mutatorB, 'handleAction');

        let combinedMutator = new CombinedMutator({
            A: mutatorA,
            B: mutatorB,
        });

        // Act
        combinedMutator.handleAction({ A: 'a', B: 'b' }, actionMessage, null);

        // Assert
        expect(spyA.calls.argsFor(0)[0]).toBe('a');
        expect(spyA.calls.argsFor(0)[1]).toBe(actionMessage);
        expect(spyB.calls.argsFor(0)[0]).toBe('b');
        expect(spyB.calls.argsFor(0)[1]).toBe(actionMessage);
    });

    it('replaces a child state when the replaceState callback gets called', () => {
        // Arrange
        spyOn(
            mutatorA,
            'handleAction'
        ).and.callFake((state: any, actionMessage: any, replaceState: Function) => {
            replaceState('x');
        });

        let state = { A: 'a' };
        let combinedMutator = new CombinedMutator({ A: mutatorA });

        // Act
        combinedMutator.handleAction(state, {}, null);

        // Assert
        expect(state.A).toBe('x');
    });
});
