import 'jasmine';
import getRootStore from '../src/getRootStore';
import createStore from '../src/createStore';
import { __resetGlobalContext } from '../src/globalContext';
import Mutator from '../src/Mutator';
import * as dispatcher from '../src/dispatcher';
import * as wrapMutator from '../src/wrapMutator';

describe('createStore', () => {
    beforeEach(() => {
        __resetGlobalContext();
    });

    it('creates a subtree under rootStore', () => {
        // Arrange
        let initialState = { testProp: 'testValue' };

        // Act
        let store = createStore('testStore', initialState)();

        // Assert
        expect(store).toEqual(initialState);
        expect(getRootStore().get('testStore')).toEqual(initialState);
    });

    it('can create a store from a mutator', () => {
        // Arrange
        let initialState = { testProp: 'testValue' };
        let mutator = new Mutator(initialState);

        // Act
        let store = createStore('testStore', mutator)();

        // Assert
        expect(store).toEqual(initialState);
        expect(getRootStore().get('testStore')).toEqual(initialState);
    });

    it('forwards actions from the dispatcher to the mutator', () => {
        // Arrange
        let testAction = {};
        let initialState = { testProp: 'testValue' };
        let mutator = new Mutator(initialState);

        let subscribeAllSpy = spyOn(dispatcher, 'subscribeAll');
        let wrapMutatorSpy = spyOn(wrapMutator, 'default').and.callFake((target: any) => target);
        let handleActionSpy = spyOn(mutator, 'handleAction');

        let store = createStore('testStore', mutator)();
        let subscribeAllCallback = subscribeAllSpy.calls.argsFor(0)[0];

        // Act
        subscribeAllCallback(testAction);

        // Assert
        expect(wrapMutatorSpy).toHaveBeenCalled();
        expect(handleActionSpy.calls.argsFor(0)[0]).toBe(store);
        expect(handleActionSpy.calls.argsFor(0)[1]).toBe(testAction);
    });
});
