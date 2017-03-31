import 'jasmine';
import promiseMiddleware from '../lib/promiseMiddleware';

describe("promiseMiddleware", () => {

    it("calls next with arguments", () => {
        // Arrange
        let originalAction = () => {};
        let originalActionType = "testAction";
        let originalArguments = <IArguments>{};
        let originalActionContext = {a:1}
        let next = jasmine.createSpy("next");

        // Act
        promiseMiddleware(
            next,
            originalAction,
            originalActionType,
            originalArguments,
            originalActionContext);

        // Assert
        expect(next).toHaveBeenCalledWith(originalAction, originalActionType, originalArguments, originalActionContext);
    });

});
