import ActionCreator from './interfaces/ActionCreator';
import ActionMessage from './interfaces/ActionMessage';
import { getPrivateActionId } from './actionCreator';

export type MutatorHandler<TState, TAction extends ActionMessage> = (
    state: TState,
    action: TAction
) => TState | void;

export class Mutator<TState> {
    private handlers: { [actionId: string]: MutatorHandler<TState, ActionMessage> } = {};

    constructor(private initialValue: TState) {}

    getInitialValue() {
        return this.initialValue;
    }

    handles<TAction extends ActionMessage>(
        actionCreator: ActionCreator<TAction>,
        handler: MutatorHandler<TState, TAction>
    ) {
        let actionId = getPrivateActionId(actionCreator);
        if (this.handlers[actionId]) {
            throw new Error('A mutator may not handle the same action twice.');
        }

        this.handlers[actionId] = handler;
        return this;
    }

    handleAction(
        currentState: TState,
        actionMessage: ActionMessage,
        replaceState: (newState: TState) => void
    ) {
        let actionId = getPrivateActionId(actionMessage);
        let handler = this.handlers[actionId];
        if (handler) {
            let returnValue = handler(currentState, actionMessage);
            if (returnValue !== undefined) {
                // TODO: does checking for undefined work??
                replaceState(<TState>returnValue);
            }
        }
    }
}

export function createMutator<TState>(initialValue: TState) {
    return new Mutator(initialValue);
}
