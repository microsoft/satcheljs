import 'jasmine';
import { getCurrentAction, promiseMiddleware } from '../lib/promiseMiddleware';
import * as install from '../lib/install';

describe("promiseMiddleware", () => {

    let uninstallSpy: jasmine.Spy;

    beforeEach(() => {
        uninstallSpy = jasmine.createSpy("uninstall");
        spyOn(install, "default").and.returnValue(uninstallSpy);
    });

    it("calls install to monkeypatch Promise for the duration of the action", () => {
        // Arrange
        let next = () => {
            expect(install.default).toHaveBeenCalled();
            expect(uninstallSpy).not.toHaveBeenCalled();
        };

        // Act
        promiseMiddleware(next, null, null, null, null);

        // Assert
        expect(uninstallSpy).toHaveBeenCalled();
    });

    it("does not uninstall until all recursive actions have completed", () => {
        // Act
        let outerNext = () => {
            let innerNext = () => {
                expect(uninstallSpy).not.toHaveBeenCalled();
            };

            promiseMiddleware(innerNext, null, null, null, null);
            expect(uninstallSpy).not.toHaveBeenCalled();
        };

        promiseMiddleware(outerNext, null, null, null, null);

        // Assert
        expect(uninstallSpy).toHaveBeenCalled();
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
