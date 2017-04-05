import 'jasmine';
import { getCurrentAction, promiseMiddleware } from '../lib/promiseMiddleware';
import * as install from '../lib/install';

describe("promiseMiddleware", () => {

    beforeEach(() => {
        spyOn(install, "default");
    });

    it("calls install to monkeypatch Promise", () => {
        // Act
        promiseMiddleware(() => {}, null, null, null, null);

        // Assert
        expect(install.default).toHaveBeenCalled();
    });

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

    it("keeps track of the current action", () => {
        // Arrange
        let actionType = "testAction";
        let currentAction;
        let next = () => { currentAction = getCurrentAction(); };

        // Act
        promiseMiddleware(next, null, actionType, null, null);

        // Assert
        expect(currentAction).toBe(actionType);
    });

    it("keeps track of recursive actions", () => {
        // Arrange
        let outerAction = "outerAction";
        let innerAction = "innerAction";
        let currentActionValues: string[] = [];

        // Act
        let outerNext = () => {
            currentActionValues.push(getCurrentAction());
            let innerNext = () => { currentActionValues.push(getCurrentAction()); };
            promiseMiddleware(innerNext, null, innerAction, null, null);
            currentActionValues.push(getCurrentAction());
        };

        promiseMiddleware(outerNext, null, outerAction, null, null);

        // Assert
        expect(currentActionValues).toEqual([ outerAction, innerAction, outerAction ]);
    });

});
