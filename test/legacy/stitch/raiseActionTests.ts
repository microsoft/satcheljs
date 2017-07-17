import 'jasmine';
import * as actionImport from '../../../src/legacy/action';
import { raiseAction } from '../../../src/legacy/stitch';

interface TestActionType {
    (arg1: string, arg2: string): void;
}

describe('raiseAction', () => {
    it('returns a dummy action of the given type', () => {
        // Arrange
        let createdAction = jasmine.createSpy('createdAction');
        spyOn(actionImport, 'default').and.returnValue((rawAction: Function) => createdAction);

        // Act
        raiseAction<TestActionType>('testAction')('arg1', 'arg2');

        // Assert
        expect(actionImport.default).toHaveBeenCalledWith('testAction');
        expect(createdAction).toHaveBeenCalledWith('arg1', 'arg2');
    });
});
