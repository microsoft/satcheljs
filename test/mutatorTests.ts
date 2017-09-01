import 'jasmine';
import mutator from '../src/mutator';
import * as dispatcher from '../src/dispatcher';
import * as mobx from 'mobx';

describe('mutator', () => {
    it('throws if the action creator does not have an action ID', () => {
        // Arrange
        let actionCreator: any = {};

        // Act / Assert
        expect(() => {
            mutator(actionCreator, () => {});
        }).toThrow();
    });

    it('subscribes the target function to the action', () => {
        // Arrange
        let actionId = 'testAction';
        let actionCreator: any = { __SATCHELJS_ACTION_ID: actionId };
        spyOn(dispatcher, 'subscribe');

        // Act
        mutator(actionCreator, () => {});

        // Assert
        expect(dispatcher.subscribe).toHaveBeenCalled();
        expect((<jasmine.Spy>dispatcher.subscribe).calls.argsFor(0)[0]).toBe(actionId);
    });

    it('wraps the subscribed callback in a MobX action', () => {
        // Arrange
        let callback = () => {};
        let wrappedCallback = () => {};
        let actionCreator: any = { __SATCHELJS_ACTION_ID: 'testAction' };
        spyOn(dispatcher, 'subscribe');
        spyOn(mobx, 'action').and.returnValue(wrappedCallback);

        // Act
        mutator(actionCreator, callback);

        // Assert
        expect(mobx.action).toHaveBeenCalledWith(callback);
    });

    it('returns the target function', () => {
        // Arrange
        let actionCreator: any = { __SATCHELJS_ACTION_ID: 'testAction' };
        let callback = () => {};

        // Act
        let returnValue = mutator(actionCreator, callback);

        // Assert
        expect(returnValue).toBe(callback);
    });
});
