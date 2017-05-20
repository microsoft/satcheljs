import { action } from 'mobx';

import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import Subscriber from './interfaces/Subscriber';
import { getActionType } from './actionCreator';
import { subscribe } from './dispatcher';

export function mutator<T extends ActionMessage>(
    actionCreator: ActionCreator<T>,
    target: Subscriber<T>): Subscriber<T>
{
    setMutatorType(target, getActionType(actionCreator));
    return target;
}

export function registerMutators(...mutators: Subscriber<any>[]) {
    mutators.forEach((subscriber) => {
        let mutatorType = getMutatorType(subscriber);
        if (!mutatorType) {
            throw new Error("Provided function is not a mutator.");
        }

        subscribe(
            mutatorType,
            action(subscriber));
    });
}

export function getMutatorType(target: ActionCreator<any>) {
    return (target as any).__SATCHELJS_MUTATOR_TYPE;
}

export function setMutatorType(target: ActionCreator<any>, actionType: string) {
    (target as any).__SATCHELJS_MUTATOR_TYPE = actionType;
}
