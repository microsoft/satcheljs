import type SimpleAction from './interfaces/SimpleAction';
import type Satchel from './interfaces/Satchel';
import mutator from './mutator';

type MutatorDecorator = typeof mutator;

export function createSimpleSubscriber(decorator: MutatorDecorator) {
    return function simpleSubscriber<TFunction extends (...args: any) => any>(
        satchelInstance: Satchel,
        actionType: string,
        target: TFunction
    ): SimpleAction<TFunction> {
        // Create the action creator
        let simpleActionCreator = satchelInstance.action(
            actionType,
            function simpleActionCreator() {
                return {
                    args: arguments,
                };
            }
        );

        // Create the subscriber
        const subscriber = decorator(
            simpleActionCreator,
            function simpleSubscriberCallback(actionMessage: any) {
                return target.apply(null, actionMessage.args);
            }
        );

        satchelInstance.register(subscriber);

        // Return a function that dispatches that action
        return simpleActionCreator as any as SimpleAction<TFunction>;
    };
}

export const mutatorAction = createSimpleSubscriber(mutator);
