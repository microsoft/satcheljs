import 'jasmine';
import { createTestSatchel } from './utils/createTestSatchel';
import { getPrivateActionType, getPrivateActionId } from '../src/privatePropertyUtils';

describe('actionCreator', () => {
    it('returns the created action message', () => {
        // Arrange
        const satchel = createTestSatchel();
        const testAction = satchel.actionCreator('testAction', (arg0, arg1) => {
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
        const satchel = createTestSatchel();
        const testAction = satchel.actionCreator('testAction');

        // Act
        let actionMessage = testAction();

        // Assert
        expect(actionMessage).not.toBeNull();
    });

    it('stamps the action message with the type and private action ID', () => {
        // Arrange
        const satchel = createTestSatchel();
        spyOn(satchel, '__createActionId').and.returnValue('id0');
        let actionType = 'testAction';
        const testAction = satchel.actionCreator(actionType);

        // Act
        let actionMessage = testAction();

        // Assert
        expect((actionMessage as any).type).toBe(actionType);
        expect(getPrivateActionId(actionMessage)).toBe('id0');
    });

    it('does not dispatch the action message', () => {
        // Arrange
        const satchel = createTestSatchel();
        const testAction = satchel.actionCreator('testAction');
        spyOn(satchel, 'dispatch');

        // Act
        testAction();

        // Assert
        expect(satchel.dispatch).not.toHaveBeenCalled();
    });

    it('throws if the action message already has a type', () => {
        // Arrange
        const satchel = createTestSatchel();
        const testAction = satchel.actionCreator('testAction', () => {
            return { type: 'testAction' };
        });

        // Act / Assert
        expect(testAction).toThrow();
    });

    it('gets stamped with the private action ID', () => {
        // Arrange
        const satchel = createTestSatchel();
        spyOn(satchel, '__createActionId').and.returnValue('id1');

        // Act
        const testAction = satchel.actionCreator('testAction');

        // Assert
        expect(getPrivateActionId(testAction)).toBe('id1');
    });

    it('gets stamped with the action type', () => {
        // Act
        const satchel = createTestSatchel();
        const testAction = satchel.actionCreator('testAction');

        // Assert
        expect(getPrivateActionType(testAction)).toBe('testAction');
    });
});

describe('action', () => {
    it('dispatches the action message', () => {
        // Arrange
        let actionMessage = {};
        const satchel = createTestSatchel();
        const testAction = satchel.action('testAction', () => actionMessage);
        spyOn(satchel, 'dispatch');

        // Act
        testAction();

        // Assert
        expect(satchel.dispatch).toHaveBeenCalledWith(actionMessage);
    });
});
