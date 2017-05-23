import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getActionType } from './actionCreator';
import { subscribe } from './dispatcher';

export function orchestrator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: Subscriber<T>)
{
    setOrchestratorType(target, getActionType(actionCreator));
    return target;
}

export function registerOrchestrators(...orchestrators: Subscriber<any>[]) {
    orchestrators.forEach((subscriber) => {
        let orchestratorType = getOrchestratorType(subscriber);
        if (!orchestratorType) {
            throw new Error("Provided function is not an orchestrator.");
        }

        subscribe(
            orchestratorType,
            subscriber);
    });
}

function getOrchestratorType(target: ActionCreator<any>) {
    return (target as any).__SATCHELJS_ORCHESTRATOR_TYPE;
}

function setOrchestratorType(target: ActionCreator<any>, actionType: string) {
    (target as any).__SATCHELJS_ORCHESTRATOR_TYPE = actionType;
}
