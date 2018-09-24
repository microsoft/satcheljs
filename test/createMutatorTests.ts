import createMutator from '../src/createMutator';

describe('createMutator', () => {
    it('returns a mutator with the given initial value', () => {
        // Arrange
        const initialValue = {};

        // Act
        const mutator = createMutator(initialValue);

        // Assert
        expect(mutator.getInitialValue()).toBe(initialValue);
    });
});
