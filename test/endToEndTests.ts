import 'jasmine';
import { autorun } from 'mobx';
import { __resetGlobalContext } from '../src/globalContext';
import {
    action,
    applyMiddleware,
    createStore,
    dispatch,
    mutator,
    mutatorAction,
    orchestrator,
} from '../src/index';

describe('satcheljs', () => {
    beforeEach(function() {
        __resetGlobalContext();
    });

    it('mutators subscribe to actions', () => {
        let actualValue;

        // Create an action creator
        let testAction = action('testAction', function testAction(value: string) {
            return {
                value: value,
            };
        });

        // Create a mutator that subscribes to it
        mutator(testAction, function(actionMessage: any) {
            actualValue = actionMessage.value;
        });

        // Dispatch the action
        testAction('test');

        // Validate that the mutator was called with the dispatched action
        expect(actualValue).toBe('test');
    });

    it('mutatorAction dispatches an action and subscribes to it', () => {
        // Arrange
        let arg1Value;
        let arg2Value;

        let testMutatorAction = mutatorAction<void>('testMutatorAction', function testMutatorAction(
            arg1: string,
            arg2: number
        ) {
            arg1Value = arg1;
            arg2Value = arg2;
        });

        // Act
        testMutatorAction('testValue', 2);

        // Assert
        expect(arg1Value).toBe('testValue');
        expect(arg2Value).toBe(2);
    });

    it('mutators can modify the store', () => {
        // Arrange
        let store = createStore('testStore', { testProperty: 'testValue' })();
        autorun(() => store.testProperty); // strict mode only applies if store is observed
        let modifyStore = action('modifyStore');

        mutator(modifyStore, () => {
            store.testProperty = 'newValue';
        });

        // Act
        modifyStore();

        // Assert
        expect(store.testProperty).toBe('newValue');
    });

    it('orchestrators cannot modify the store', () => {
        // Arrange
        let store = createStore('testStore', { testProperty: 'testValue' })();
        autorun(() => store.testProperty); // strict mode only applies if store is observed
        let modifyStore = action('modifyStore');

        orchestrator(modifyStore, () => {
            store.testProperty = 'newValue';
        });

        // Act / Assert
        expect(() => {
            modifyStore();
        }).toThrow();
    });

    it('all subscribers are handled in one transaction', () => {
        // Arrange
        let store = createStore('testStore', { testProperty: 0 })();
        let modifyStore = action('modifyStore');

        mutator(modifyStore, () => {
            store.testProperty++;
        });

        mutator(modifyStore, () => {
            store.testProperty++;
        });

        let values: number[] = [];
        autorun(() => {
            values.push(store.testProperty);
        });

        // Act
        modifyStore();

        // Assert
        expect(values).toEqual([0, 2]);
    });

    it('middleware gets called during dispatch', () => {
        // Arrange
        let actualValue;
        let expectedValue = { type: 'testMiddleware' };

        applyMiddleware((next, actionMessage) => {
            actualValue = actionMessage;
            next(actionMessage);
        });

        // Act
        dispatch(expectedValue);

        // Assert
        expect(actualValue).toBe(expectedValue);
    });

    it('middleware can handle promises returned from orchestrators', async () => {
        // Arrange
        let testAction = action('testAction');
        orchestrator(testAction, () => Promise.resolve(1));
        orchestrator(testAction, () => Promise.resolve(2));

        let returnedPromise;
        applyMiddleware((next, actionMessage) => {
            returnedPromise = next(actionMessage);
        });

        // Act
        testAction();
        let promiseValues = await returnedPromise;

        // Assert
        expect(promiseValues).toEqual([1, 2]);
    });
});
