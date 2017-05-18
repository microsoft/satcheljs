import SimpleAction from './interfaces/SimpleAction';
import actionCreator from './actionCreator';
import bindToDispatch from './bindToDispatch';
import mutator from './mutator';

export default function simpleAction<T extends SimpleAction>(
    actionType: string,
    target: T): T
{
    // Create an action dispatcher
    let simpleActionCreator = bindToDispatch(actionCreator(
        actionType,
        function simpleActionCreator() {
            return {
                type: actionType,
                args: arguments
            };
        }));

    // Create a mutator that subscribes to that action creator
    mutator(
        simpleActionCreator,
        function simpleActionMutator(actionMessage) {
            target.apply(null, actionMessage.args);
        });

    // Return a function that dispatches that action
    return simpleActionCreator as any as T;
}
