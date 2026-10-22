import 'jasmine';
import { createActionCreatorFactory, createActionFactory } from '../src/actionCreator';
import * as createActionId from '../src/createActionId';
import createSatchelState from '../src/createSatchelState';
import { getPrivateActionType, getPrivateActionId } from '../src/privatePropertyUtils';

describe('actionCreator', () => {
    it('returns the created action message', () => {
        // Arrange
        const actionCreator = createActionCreatorFactory(createSatchelState());
        const testAction = actionCreator('testAction', (arg0, arg1) => {
            return {
                arg0,
                arg1,
            };
        });

        // Act
        let actionMessage = testAction('value0', 'value1');

        // Assert
        expect(actionMessage.arg0).toBe('value0');
        expect(actionMessage.arg1).toBe('value1');
    });

    it('returns a default action message if no factory is provided', () => {
        // Arrange
        const actionCreator = createActionCreatorFactory(createSatchelState());
        const testAction = actionCreator('testAction');

        // Act
        let actionMessage = testAction();

        // Assert
        expect(actionMessage).not.toBeNull();
    });

    it('stamps the action message with the type and private action ID', () => {
        // Arrange
        spyOn(createActionId, 'default').and.returnValue('id0');
        const actionCreator = createActionCreatorFactory(createSatchelState());
        let actionType = 'testAction';
        const testAction = actionCreator(actionType);

        // Act
        let actionMessage = testAction();

        // Assert
        expect((actionMessage as any).type).toBe(actionType);
        expect(getPrivateActionId(actionMessage)).toBe('id0');
    });

    it('does not add private properties to the action message', () => {
        // Arrange
        const actionCreator = createActionCreatorFactory(createSatchelState());
        const testAction = actionCreator('testAction', () => ({ value: 1 }));

        // Act
        const actionMessage = testAction();

        // Assert
        expect(Object.getOwnPropertyNames(actionMessage).sort()).toEqual(['type', 'value']);
        expect(JSON.parse(JSON.stringify(actionMessage))).toEqual({
            type: 'testAction',
            value: 1,
        });
    });

    it('throws if the action message already has a type', () => {
        // Arrange
        const actionCreator = createActionCreatorFactory(createSatchelState());
        const testAction = actionCreator('testAction', () => {
            return { type: 'testAction' };
        });

        // Act / Assert
        expect(testAction).toThrow();
    });

    it('gets stamped with the private action ID', () => {
        // Arrange
        spyOn(createActionId, 'default').and.returnValue('id1');
        const actionCreator = createActionCreatorFactory(createSatchelState());

        // Act
        const testAction = actionCreator('testAction');

        // Assert
        expect(getPrivateActionId(testAction)).toBe('id1');
    });

    it('gets stamped with the action type', () => {
        // Act
        const actionCreator = createActionCreatorFactory(createSatchelState());
        const testAction = actionCreator('testAction');

        // Assert
        expect(getPrivateActionType(testAction)).toBe('testAction');
    });

    it('reserves an empty subscription entry for the action', () => {
        // Arrange
        const state = createSatchelState();
        const actionCreator = createActionCreatorFactory(state);

        // Act
        const testAction = actionCreator('testAction');

        // Assert
        expect(state.subscriptions.get(getPrivateActionId(testAction))).toEqual([]);
    });

    it('creates unique action IDs across satchel instances', () => {
        // Arrange
        const actionCreator1 = createActionCreatorFactory(createSatchelState());
        const actionCreator2 = createActionCreatorFactory(createSatchelState());

        // Act
        const testAction1 = actionCreator1('testAction');
        const testAction2 = actionCreator2('testAction');

        // Assert
        expect(getPrivateActionId(testAction1)).not.toBe(getPrivateActionId(testAction2));
    });
});

describe('action', () => {
    it('dispatches the action message', () => {
        // Arrange
        let actionMessage = {};
        const dispatch = jasmine.createSpy('dispatch');
        const action = createActionFactory(createSatchelState(), dispatch);
        const testAction = action('testAction', () => actionMessage);

        // Act
        testAction();

        // Assert
        expect(dispatch).toHaveBeenCalledWith(actionMessage);
    });
});
