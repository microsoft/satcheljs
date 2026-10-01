import 'jasmine';
import mutator from '../src/mutator';
import orchestrator from '../src/orchestrator';
import { createTestSatchel } from './utils/createTestSatchel';

describe('register', () => {
    it('registers a callback for a given action', () => {
        // Arrange
        const satchel = createTestSatchel();
        const testAction = satchel.actionCreator('testAction');
        const callback = () => {};

        // Act
        satchel.register(orchestrator(testAction, callback));

        // Assert
        expect(satchel.getSubscriptions()['0']).toEqual([callback]);
    });

    it('can register multiple callbacks for the same action', () => {
        // Arrange
        const satchel = createTestSatchel();
        const testAction = satchel.actionCreator('testAction');
        const callback0 = () => {};
        const callback1 = () => {};

        // Act
        satchel.register(orchestrator(testAction, callback0));
        satchel.register(orchestrator(testAction, callback1));

        // Assert
        expect(satchel.getSubscriptions()['0']).toEqual([callback0, callback1]);
    });

    it('registers the same subscriber only once', () => {
        // Arrange
        const satchel = createTestSatchel();
        const testAction = satchel.actionCreator('testAction');
        const testMutator = mutator(testAction, () => {});

        // Act
        satchel.register(testMutator);
        satchel.register(testMutator);

        // Assert
        expect(satchel.getSubscriptions()['0'].length).toBe(1);
    });

    it('can register the same subscriber with multiple satchels', () => {
        // Arrange
        const satchel1 = createTestSatchel();
        const satchel2 = createTestSatchel();
        const actionCreator: any = { __SATCHELJS_ACTION_ID: 'testAction' };
        const testOrchestrator = orchestrator(actionCreator, () => {});

        // Act
        satchel1.register(testOrchestrator);
        satchel2.register(testOrchestrator);

        // Assert
        expect(satchel1.hasSubscribers(actionCreator)).toBe(true);
        expect(satchel2.hasSubscribers(actionCreator)).toBe(true);
    });

    it('throws if the action creator was created by a different satchel', () => {
        // Arrange
        const satchel1 = createTestSatchel();
        const satchel2 = createTestSatchel();
        const testAction = satchel1.actionCreator('testAction');

        // Act / Assert
        expect(() => satchel2.register(orchestrator(testAction, () => {}))).toThrowError(
            'Action (testAction) was created by a different satchel instance.'
        );
        expect(satchel2.getSubscriptions()).toEqual({});
    });
});
