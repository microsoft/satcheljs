import SimpleAction from './interfaces/SimpleAction';
import { action } from './actionCreator';
import mutator from './mutator';

export function createSimpleSubscriber(decorator: Function) {
    return function simpleSubscriber<TFunction extends (...args: any) => any>(
        actionType: string,
        target: TFunction
    ): SimpleAction<TFunction> {
        // Create the action creator
        let simpleActionCreator = action(actionType, function simpleActionCreator() {
            return {
                args: arguments,
            };
        });

        // Create the subscriber
        decorator(simpleActionCreator, function simpleSubscriberCallback(actionMessage: any) {
            return target.apply(null, actionMessage.args);
        });

        // Return a function that dispatches that action
        return (simpleActionCreator as any) as SimpleAction<TFunction>;
    };
}

export const mutatorAction = createSimpleSubscriber(mutator);
