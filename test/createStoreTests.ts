import 'jasmine';
import getRootStore from '../src/getRootStore';
import createStore from '../src/createStore';
import { __resetGlobalContext } from '../src/globalContext';
import Mutator from '../src/Mutator';

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

    it('can create a store from a mutator', () => {
        // Arrange
        __resetGlobalContext();
        let initialState = { testProp: 'testValue' };
        let mutator = new Mutator(initialState);

        // Act
        let store = createStore('testStoreFromMutator', mutator)();

        // Assert
        expect(store).toEqual(initialState);
        expect(getRootStore().get('testStoreFromMutator')).toEqual(initialState);
    });
});
