import 'jasmine';
import { createSatchel } from '../src/createSatchel';

describe('createStore', () => {
    it('creates a subtree under rootStore', () => {
        // Arrange
        const satchel = createSatchel();
        let initialState = { testProp: 'testValue' };

        // Act
        let store = satchel.createStore('testStore', initialState)();

        // Assert
        expect(store).toEqual(initialState);
        expect(satchel.getRootStore().get('testStore')).toEqual(initialState);
    });

    it('prevents creating a store with the same name', () => {
        // Arrange
        const satchel = createSatchel();
        let initialState = { testProp: 'testValue' };
        let secondaryState = { testProp: 'overwritten' };

        // Act
        satchel.createStore('testStore', initialState)();

        // Assert
        expect(() => satchel.createStore('testStore', secondaryState)()).toThrow(
            'A store named testStore has already been created.'
        );

        expect(satchel.getRootStore().get('testStore')).toEqual(initialState);
    });
});
