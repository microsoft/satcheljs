import 'jasmine';
import createActionId from '../src/createActionId';
import { __resetGlobalContext } from '../src/globalContext';

describe('createActionId', () => {
    it('returns the next incremental ID for each call', () => {
        // Arrange
        __resetGlobalContext();

        // Act / Assert
        expect(createActionId()).toBe('0');
        expect(createActionId()).toBe('1');
        expect(createActionId()).toBe('2');
    });
});
