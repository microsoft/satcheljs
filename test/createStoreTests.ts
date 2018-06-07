import 'jasmine';
import getRootStore from '../src/getRootStore';
import createStore from '../src/createStore';
import { __resetGlobalContext } from '../src/globalContext';

describe('createStore', () => {
    it('creates a subtree under rootStore', () => {
        // Arrange
        __resetGlobalContext();
        let initialState = { testProp: 'testValue' };

        // Act
        let store = createStore('testStore', initialState)();

        // Assert
        expect(store).toEqual(initialState);
        expect(getRootStore().get('testStore')).toEqual(initialState);
    });
});
