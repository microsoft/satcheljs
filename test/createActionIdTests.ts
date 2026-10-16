import 'jasmine';
import createActionId from '../src/createActionId';

describe('createActionId', () => {
    it('returns the next incremental ID for each call', () => {
        // Arrange
        const firstId = Number(createActionId());

        // Act / Assert
        expect(createActionId()).toBe(String(firstId + 1));
        expect(createActionId()).toBe(String(firstId + 2));
    });
});
