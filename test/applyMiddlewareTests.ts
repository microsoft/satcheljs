import 'jasmine';
import { DispatchFunction } from '../src';
import { createDispatchWithMiddleware } from '../src/createSatchel';
import { createTestSatchel } from './utils/createTestSatchel';

describe('applyMiddleware', () => {
    it('updates dispatchWithMiddleware to point to the middleware pipeline', () => {
        // Arrange
        let testMiddleware = jasmine.createSpy('testMiddleware');
        const satchel = createTestSatchel({ middleware: [testMiddleware] });

        // Act
        satchel.__dispatchWithMiddleware({});

        // Assert
        expect(testMiddleware).toHaveBeenCalled();
    });

    it('the action message and next delegate get passed to middleware', () => {
        // Arrange
        let dispatchedActionMessage = {};
        let actualNext;
        let actualActionMessage;

        const testMiddleware = (next: any, actionMessage: any) => {
            actualNext = next;
            actualActionMessage = actionMessage;
        };
        const satchel = createTestSatchel({ middleware: [testMiddleware] });

        // Act
        satchel.__dispatchWithMiddleware(dispatchedActionMessage);

        // Assert
        expect(actualActionMessage).toBe(dispatchedActionMessage);
        expect(actualNext).toBe(satchel.__finalDispatch);
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
