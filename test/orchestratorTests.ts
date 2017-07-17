import 'jasmine';
import orchestrator from '../src/orchestrator';
import * as dispatcher from '../src/dispatcher';

describe('orchestrator', () => {
    it('throws if the action creator does not have an action ID', () => {
        // Arrange
        let actionCreator: any = {};

        // Act / Assert
        expect(() => {
            orchestrator(actionCreator, () => {});
        }).toThrow();
    });

    it('subscribes the target function to the action', () => {
        // Arrange
        let callback = () => {};
        let actionId = 'testAction';
        let actionCreator: any = { __SATCHELJS_ACTION_ID: actionId };
        spyOn(dispatcher, 'subscribe');

        // Act
        orchestrator(actionCreator, callback);

        // Assert
        expect(dispatcher.subscribe).toHaveBeenCalledWith(actionId, callback);
    });

    it('returns the target function', () => {
        // Arrange
        let actionCreator: any = { __SATCHELJS_ACTION_ID: 'testAction' };
        let callback = () => {};

        // Act
        let returnValue = orchestrator(actionCreator, callback);

        // Assert
        expect(returnValue).toBe(callback);
    });
});
