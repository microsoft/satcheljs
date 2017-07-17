import 'jasmine';
import * as actionImports from '../../../src/legacy/action';
import { raise } from '../../../src/legacy/stitch';

describe('raise', () => {
    beforeEach(() => {
        spyOn(console, 'error');
    });

    it('creates an action of the given type', () => {
        spyOn(actionImports, 'default').and.returnValue((rawAction: Function) => rawAction);
        raise('testAction');
        expect(actionImports.default).toHaveBeenCalledWith('testAction');
    });

    it('passes the action to the callback', () => {
        let actionToCreate = () => {};
        let passedAction: Function;
        spyOn(actionImports, 'default').and.returnValue((rawAction: Function) => actionToCreate);

        raise('testAction', actionToExecute => {
            passedAction = actionToExecute;
        });

        expect(passedAction).toBe(actionToCreate);
    });

    it('executes the action if no callback was provided', () => {
        let actionExecuted = false;
        let actionToCreate = () => {
            actionExecuted = true;
        };
        spyOn(actionImports, 'default').and.returnValue((rawAction: Function) => actionToCreate);
        raise('testAction');
        expect(actionExecuted).toBeTruthy();
    });
});
