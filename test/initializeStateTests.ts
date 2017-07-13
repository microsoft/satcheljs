import 'jasmine';
import getRootStore from '../src/getRootStore';
import initializeState from '../src/initializeState';
import { __resetGlobalContext } from '../src/globalContext';

describe('initializeState', () => {
    it('replaces the properties of rootStore', () => {
        // Arrange
        __resetGlobalContext();
        var initialState = { testStore: 1 };

        // Act
        initializeState(initialState);

        // Assert
        expect(getRootStore().get('testStore')).toEqual(1);
    });
});
