import ActionMessage from './interfaces/ActionMessage';
import ActionCreator from './interfaces/ActionCreator';
import { dispatch } from './dispatcher';

export default function actionDispatcher(actionType: string) {
    return function createActionDispatcher<T extends ActionCreator>(target: T): T {
        return function createAndDispatchAction(...args: any[]) {
            let actionMessage: ActionMessage = target.apply(null, args);

            // Ideally we'd just stamp the type property on the action message at this point, but
            // if the consumer doesn't include it then TypeScript infers that it is not there and,
            // as far as the compiler is concerned, it won't be available on the returned type.
            // This issue should improve things: https://github.com/Microsoft/TypeScript/issues/5453
            if (actionMessage.type != actionType) {
                throw new Error("The action type must match the type property on the action message.");
            }

            dispatch(actionMessage);
            return actionMessage;
        } as T;
    };
}

