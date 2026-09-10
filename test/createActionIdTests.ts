import 'jasmine';
import { createTestSatchel } from './utils/createTestSatchel';

describe('createActionId', () => {
    it('returns the next incremental ID for each call', () => {
        // Arrange
        const satchel = createTestSatchel();

        // Act / Assert
        expect(satchel.__createActionId()).toBe('0');
        expect(satchel.__createActionId()).toBe('1');
        expect(satchel.__createActionId()).toBe('2');
    });
});
