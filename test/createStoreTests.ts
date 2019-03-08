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

    it('prevents creating a store with the same name', () => {
        // Arrange
        __resetGlobalContext();
        let initialState = { testProp: 'testValue' };

        let secondaryState = { testProp: 'overwritten' };

        // Act
        let store = createStore('testStore', initialState)();

        // Assert
        expect(() => createStore('testStore', secondaryState)()).toThrow(
            'A store named testStore has already been created.'
        );
        expect(getRootStore().get('testStore')).toEqual(initialState);
    });
});
