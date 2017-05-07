import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { subscribe } from './dispatcher';

export default function orchestrator<T extends ActionMessage>(actionCreator: ActionCreator<T>) {
    return function subscribeOrchestrator(callback: Subscriber<T>) {
        subscribe(actionCreator, callback);
    }
}
