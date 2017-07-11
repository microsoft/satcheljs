import 'jasmine';
import * as satcheljsImports from '../../../src';
import { raise } from '../../../src/legacy/stitch';

describe('raise', () => {
    beforeEach(() => {
        spyOn(console, 'error');
    });

    it('creates an action of the given type', () => {
        spyOn(satcheljsImports, 'action').and.returnValue((rawAction: Function) => rawAction);
        raise('testAction');
        expect(satcheljsImports.action).toHaveBeenCalledWith('testAction');
    });

    it('passes the action to the callback', () => {
        let actionToCreate = () => {};
        let passedAction: Function;
        spyOn(satcheljsImports, 'action').and.returnValue((rawAction: Function) => actionToCreate);

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
        spyOn(satcheljsImports, 'action').and.returnValue((rawAction: Function) => actionToCreate);
        raise('testAction');
        expect(actionExecuted).toBeTruthy();
    });
});
