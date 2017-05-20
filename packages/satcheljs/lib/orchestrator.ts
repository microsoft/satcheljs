import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getActionType } from './actionCreator';
import { subscribe } from './dispatcher';

export default function orchestrator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    callback: Subscriber<T>)
{
    subscribe(getActionType(actionCreator), callback);
}
