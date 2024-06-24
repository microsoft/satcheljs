import 'jasmine';
import { autorun } from 'mobx';
import { mutator, mutatorAction, orchestrator } from '../src/index';
import { createTestSatchel } from './utils/createTestSatchel';

describe('satcheljs', () => {
    it('mutators subscribe to actions', () => {
        const satchel = createTestSatchel();
        let actualValue;

        // Create an action creator
        let testAction = satchel.action('testAction', function testAction(value: string) {
            return {
                value: value,
            };
        });

        // Create a mutator that subscribes to it
        const testMutator = mutator<any, void>(testAction, function(actionMessage: any) {
            actualValue = actionMessage.value;
        });

        // Register the mutator
        satchel.register(testMutator);

        // Dispatch the action
        testAction('test');

        // Validate that the mutator was called with the dispatched action
        expect(actualValue).toBe('test');
    });

    it('mutatorAction dispatches an action and subscribes to it', () => {
        // Arrange
        const satchel = createTestSatchel();
        let arg1Value;
        let arg2Value;

        let testMutatorAction = mutatorAction(
            satchel,
            'testMutatorAction',
            function testMutatorAction(arg1: string, arg2: number) {
                arg1Value = arg1;
                arg2Value = arg2;
            }
        );

        // Act
        testMutatorAction('testValue', 2);

        // Assert
        expect(arg1Value).toBe('testValue');
        expect(arg2Value).toBe(2);
    });

    it('mutators can modify the store', () => {
        // Arrange
        const satchel = createTestSatchel();
        let store = satchel.createStore('testStore', { testProperty: 'testValue' })();
        autorun(() => store.testProperty); // strict mode only applies if store is observed
        let modifyStore = satchel.action('modifyStore');

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
        const satchel = createTestSatchel();
        let store = satchel.createStore('testStore', { testProperty: 'testValue' })();
        autorun(() => store.testProperty); // strict mode only applies if store is observed
        let modifyStore = satchel.action('modifyStore');

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
        const satchel = createTestSatchel();
        let store = satchel.createStore('testStore', { testProperty: 0 })();
        let modifyStore = satchel.action('modifyStore');

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

        const middleware = [
            (next: any, actionMessage: any) => {
                actualValue = actionMessage;
                next(actionMessage);
            },
        ];

        const satchel = createTestSatchel({ middleware });

        // Act
        satchel.dispatch(expectedValue);

        // Assert
        expect(actualValue).toBe(expectedValue);
    });

    it('middleware can handle promises returned from orchestrators', async () => {
        // Arrange
        let returnedPromise: Promise<Array<number>>;
        const middleware = [
            (next: any, actionMessage: any) => {
                returnedPromise = next(actionMessage);
            },
        ];
        const satchel = createTestSatchel({ middleware });
        let testAction = satchel.action('testAction');
        satchel.register(orchestrator(testAction, () => Promise.resolve(1)));
        satchel.register(orchestrator(testAction, () => Promise.resolve(2)));

        // Act
        testAction();
        let promiseValues = await returnedPromise;

        // Assert
        expect(promiseValues).toEqual([1, 2]);
    });
});
