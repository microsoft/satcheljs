import 'jasmine';
import getRootStore from '../src/getRootStore';
import createStoreSelector from '../src/createStoreSelector';
import initializeState from '../src/initializeState';
import { __resetGlobalContext } from '../src/globalContext';

describe('createStoreSelector', () => {
    it('creates a subtree under rootStore', () => {
        // Arrange
        __resetGlobalContext();
        let initialState = { testProp: 'testValue' };

        // Act
        let store = createStoreSelector('testStore', initialState)();

        // Assert
        expect(store).toBe(initialState);
        expect(getRootStore().get('testStore')).toBe(initialState);
    });
});
