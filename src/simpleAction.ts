import SimpleAction from './interfaces/SimpleAction';
import { boundActionCreator } from './actionCreator';
import { mutator } from './mutator';

export default function simpleAction<T extends SimpleAction>(
    actionType: string,
    target: T): T
{
    // Create an action dispatcher
    let simpleActionCreator = boundActionCreator(
        actionType,
        function simpleActionCreator() {
            return {
                args: arguments
            };
        });

    // Create a mutator
    let simpleMutator = mutator(
        simpleActionCreator,
        function simpleActionMutator(actionMessage) {
            target.apply(null, actionMessage.args);
        });

    // Return a function that dispatches that action
    return simpleActionCreator as any as T;
}
