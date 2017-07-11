import 'jasmine';
import * as satcheljsImports from 'satcheljs';
import { raiseAction } from '../src/stitch';

interface TestActionType {
    (arg1: string, arg2: string): void;
}

describe("raiseAction", () => {

    it("returns a dummy action of the given type", () => {
        // Arrange
        let createdAction = jasmine.createSpy("createdAction");
        spyOn(satcheljsImports, "action").and.returnValue((rawAction: Function) => createdAction);

        // Act
        raiseAction<TestActionType>("testAction")("arg1", "arg2");

        // Assert
        expect(satcheljsImports.action).toHaveBeenCalledWith("testAction");
        expect(createdAction).toHaveBeenCalledWith("arg1", "arg2");
    });

});
