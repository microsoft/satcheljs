import 'jasmine';
import applyMiddleware from '../src/applyMiddleware';
import * as dispatcher from '../src/dispatcher';
import { getGlobalContext, __resetGlobalContext } from '../src/globalContext';

describe('applyMiddleware', () => {
    it('updates dispatchWithMiddleware to point to the middleware pipeline', () => {
        // Arrange
        __resetGlobalContext();
        let testMiddleware = jasmine.createSpy('testMiddleware');

        // Act
        applyMiddleware(testMiddleware);
        getGlobalContext().dispatchWithMiddleware({});

        // Assert
        expect(testMiddleware).toHaveBeenCalled();
    });

    it('the action message and next delegate get passed to middleware', () => {
        // Arrange
        __resetGlobalContext();

        let dispatchedActionMessage = {};
        let actualNext;
        let actualActionMessage;

        applyMiddleware((next: any, actionMessage: any) => {
            actualNext = next;
            actualActionMessage = actionMessage;
        });

        // Act
        getGlobalContext().dispatchWithMiddleware(dispatchedActionMessage);

        // Assert
        expect(actualActionMessage).toBe(dispatchedActionMessage);
        expect(actualNext).toBe(dispatcher.finalDispatch);
    });

    it('middleware and finalDispatch get called in order', () => {
        // Arrange
        __resetGlobalContext();
        let sequence: string[] = [];

        spyOn(dispatcher, 'finalDispatch').and.callFake(() => {
            sequence.push('finalDispatch');
        });

        applyMiddleware(
            (next: any, actionMessage: any) => {
                sequence.push('middleware1');
                next(actionMessage);
            },
            (next: any, actionMessage: any) => {
                sequence.push('middleware2');
                next(actionMessage);
            }
        );

        // Act
        getGlobalContext().dispatchWithMiddleware({});

        // Assert
        expect(sequence).toEqual(['middleware1', 'middleware2', 'finalDispatch']);
    });
});
