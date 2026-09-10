import 'jasmine';
import mutator from '../src/mutator';
import * as privatePropertyUtils from '../src/privatePropertyUtils';
import { createTestSatchel } from './utils/createTestSatchel';

describe('register', () => {
    it('registers the subscriber once', () => {
        const callback = () => {};
        const actionId = 'testAction';
        const actionCreator: any = { __SATCHELJS_ACTION_ID: actionId };
        spyOn(privatePropertyUtils, 'getPrivateActionId').and.callThrough();
        const testOrchestator = mutator(actionCreator, callback);
        const satchel = createTestSatchel();

        // Act
        satchel.register(testOrchestator);
        satchel.register(testOrchestator);

        // Assert
        // This this the first function used after the check for if the subscriber is already registered
        // so it should only be called once
        expect(privatePropertyUtils.getPrivateActionId).toHaveBeenCalledTimes(1);
    });
});
