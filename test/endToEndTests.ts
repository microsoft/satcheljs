import 'jasmine';
import { boundActionCreator } from '../src/actionCreator';
import applyMiddleware from '../src/applyMiddleware';
import { dispatch } from '../src/dispatcher';
import mutator from '../src/mutator';
import { simpleMutator } from '../src/simpleSubscribers';
import createStore from '../src/createStore';

describe('satcheljs', () => {
    it('mutators subscribe to actions', () => {
        let actualValue;

        // Create an action creator
        let testAction = boundActionCreator('testAction', function testAction(value: string) {
            return {
                value: value,
            };
        });

        // Create a mutator that subscribes to it
        let onTestAction = mutator(testAction, function(actionMessage) {
            actualValue = actionMessage.value;
        });

        // Dispatch the action
        testAction('test');

        // Validate that the mutator was called with the dispatched action
        expect(actualValue).toBe('test');
    });

    it('simpleMutator dispatches an action and subscribes to it', () => {
        // Arrange
        let arg1Value;
        let arg2Value;

        let testSimpleMutator = simpleMutator('testSimpleMutator', function testSimpleMutator(
            arg1: string,
            arg2: number
        ) {
            arg1Value = arg1;
            arg2Value = arg2;
        });

        // Act
        testSimpleMutator('testValue', 2);

        // Assert
        expect(arg1Value).toBe('testValue');
        expect(arg2Value).toBe(2);
    });

    it('mutators can modify the store', () => {
        // Arrange
        let store = createStore('testStore', { testProperty: 'testValue' })();
        let modifyStore = boundActionCreator('modifyStore');

        let onModifyStore = mutator(modifyStore, actionMessage => {
            store.testProperty = 'newValue';
        });

        // Act
        modifyStore();

        // Assert
        expect(store.testProperty).toBe('newValue');
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
});
