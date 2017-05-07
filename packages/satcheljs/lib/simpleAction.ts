import SimpleAction from './interfaces/SimpleAction';
import actionCreator from './actionCreator';
import mutator from './mutator';

export default function simpleAction(actionType: string) {
    return function createSimpleAction<T extends SimpleAction>(target: T): T {
        // Create an action dispatcher
        let simpleActionCreator = actionCreator(actionType)(
            function simpleActionCreator() {
                return {
                    type: actionType,
                    args: arguments
                };
            });

        // Create a mutator that subscribes to that action creator
        mutator(simpleActionCreator)(
            function simpleActionMutator(actionMessage) {
                target.apply(null, actionMessage.args);
            });

        // Return a function that dispatches that action
        return simpleActionCreator as any as T;
    }
}
