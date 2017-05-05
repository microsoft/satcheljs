import SimpleAction from './interfaces/SimpleAction';
import actionDispatcher from './actionDispatcher';
import mutator from './mutator';

export default function simpleAction(actionType: string) {
    return function createSimpleAction<T extends SimpleAction>(target: T): T {
        // Create an action dispatcher
        let simpleActionDispatcher = actionDispatcher(actionType)(
            function simpleActionCreator() {
                return {
                    type: actionType,
                    args: arguments
                };
            });

        // Create a mutator that subscribes to that action creator
        mutator(simpleActionDispatcher)(
            function simpleActionMutator(actionMessage) {
                target.apply(null, actionMessage.args);
            });

        // Return a function that dispatches that action
        return simpleActionDispatcher as any as T;
    }
}
