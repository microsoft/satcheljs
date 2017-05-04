import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Mutator from './interfaces/Mutator';
import { subscribe } from './subscriptions';

export default function mutator<T extends ActionMessage>(actionDispatcher: ActionCreator<T>) {
    return function subscribeMutator(callback: Mutator<T>) {
        subscribe(actionDispatcher, callback);
    }
}
