import 'jasmine';
import { autorun } from 'mobx';
import { createSatchel } from '../src/createSatchel';
import { mutator, orchestrator } from '../src/index';
import { getPrivateActionId } from '../src/privatePropertyUtils';

describe('createSatchel', () => {
    it('only exposes the public API', () => {
        // Act
        const satchel = createSatchel();

        // Assert
        expect(Object.keys(satchel).sort()).toEqual([
            'action',
            'actionCreator',
            'createStore',
            'dispatch',
            'getCurrentMutator',
            'getRootStore',
            'hasSubscribers',
            'mutatorAction',
            'register',
        ]);
    });

    it('enables MobX strict mode', () => {
        // Arrange
        const satchel = createSatchel();
        const store = satchel.createStore('testStore', { testProperty: 'testValue' })();
        autorun(() => store.testProperty); // strict mode only applies if store is observed

        // Act / Assert
        expect(() => {
            store.testProperty = 'newValue';
        }).toThrow();
    });

    it('keeps satchel instances isolated', () => {
        // Arrange
        const satchel1 = createSatchel();
        const satchel2 = createSatchel();
        const action1 = satchel1.action('action1');
        const action2 = satchel2.action('action2');
        const store1 = satchel1.createStore('testStore', { value: 0 })();
        const store2 = satchel2.createStore('testStore', { value: 0 })();
        satchel1.register(
            mutator(action1, () => {
                store1.value++;
            })
        );
        satchel2.register(
            mutator(action2, () => {
                store2.value++;
            })
        );

        // Action IDs are globally unique, so they never collide across satchels
        expect(getPrivateActionId(action1)).not.toBe(getPrivateActionId(action2));

        // Act
        action2();

        // Assert
        expect(store1.value).toBe(0);
        expect(store2.value).toBe(1);
        expect(satchel1.hasSubscribers(action2)).toBe(false);
    });
});

describe('hasSubscribers', () => {
    it('returns false if the action has no subscribers', () => {
        // Arrange
        const satchel = createSatchel();
        const testAction = satchel.actionCreator('testAction');

        // Act / Assert
        expect(satchel.hasSubscribers(testAction)).toBe(false);
    });

    it('returns true if the action has subscribers', () => {
        // Arrange
        const satchel = createSatchel();
        const testAction = satchel.actionCreator('testAction');
        satchel.register(orchestrator(testAction, () => {}));

        // Act / Assert
        expect(satchel.hasSubscribers(testAction)).toBe(true);
    });

    it('returns false for an action creator from a different satchel', () => {
        // Arrange
        const satchel1 = createSatchel();
        const satchel2 = createSatchel();
        const action1 = satchel1.actionCreator('action1');
        const action2 = satchel2.actionCreator('action2');
        satchel2.register(orchestrator(action2, () => {}));

        // Act / Assert
        expect(satchel2.hasSubscribers(action1)).toBe(false);
    });
});

describe('getCurrentMutator', () => {
    it('returns null when no mutator is executing', () => {
        // Act / Assert
        expect(createSatchel().getCurrentMutator()).toBe(null);
    });
});
