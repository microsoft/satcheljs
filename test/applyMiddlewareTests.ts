import 'jasmine';
import { DispatchFunction } from '../src';
import createSatchelState from '../src/createSatchelState';
import { createDispatch, createDispatchWithMiddleware } from '../src/dispatcher';
import { setPrivateActionId } from '../src/privatePropertyUtils';

describe('applyMiddleware', () => {
    it('dispatch calls the middleware pipeline', () => {
        // Arrange
        let testMiddleware = jasmine.createSpy('testMiddleware');
        const dispatch = createDispatch(createSatchelState(), [testMiddleware]);

        // Act
        dispatch({});

        // Assert
        expect(testMiddleware).toHaveBeenCalled();
    });

    it('the action message and next delegate get passed to middleware', () => {
        // Arrange
        const state = createSatchelState();
        const subscriber = jasmine.createSpy('subscriber');
        state.subscriptions.set('testActionId', [subscriber]);

        let dispatchedActionMessage = {};
        setPrivateActionId(dispatchedActionMessage, 'testActionId');

        let actualNext: DispatchFunction;
        let actualActionMessage;

        const testMiddleware = (next: any, actionMessage: any) => {
            actualNext = next;
            actualActionMessage = actionMessage;
        };
        const dispatch = createDispatch(state, [testMiddleware]);

        // Act
        dispatch(dispatchedActionMessage);

        // Assert
        expect(actualActionMessage).toBe(dispatchedActionMessage);
        expect(subscriber).not.toHaveBeenCalled();

        // next is the final dispatch, which calls the subscribers
        actualNext(dispatchedActionMessage);
        expect(subscriber).toHaveBeenCalledWith(dispatchedActionMessage);
    });

    it('createDispatchWithMiddleware creates a function that calls middleware and finalDispatch in order', () => {
        // Arrange
        let sequence: string[] = [];
        const middleware = [
            (next: DispatchFunction, actionMessage: any) => {
                sequence.push('middleware1');
                next(actionMessage);
            },
            (next: DispatchFunction, actionMessage: any) => {
                sequence.push('middleware2');
                next(actionMessage);
            },
        ];

        const finalDispatch = () => {
            sequence.push('finalDispatch');
        };

        const testDispatchWithMiddleware = createDispatchWithMiddleware(middleware, finalDispatch);

        // Act
        testDispatchWithMiddleware({});

        // Assert
        expect(sequence).toEqual(['middleware1', 'middleware2', 'finalDispatch']);
    });
});
