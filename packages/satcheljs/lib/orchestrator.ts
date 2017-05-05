import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { subscribe } from './subscriptions';

export default function orchestrator<T extends ActionMessage>(actionDispatcher: ActionCreator<T>) {
    return function subscribeOrchestrator(callback: Subscriber<T>) {
        subscribe(actionDispatcher, callback);
    }
}
