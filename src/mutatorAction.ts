import type ActionCreator from './interfaces/ActionCreator';
import type ActionMessage from './interfaces/ActionMessage';
import type MutatorActionTarget from './interfaces/MutatorActionTarget';
import type Satchel from './interfaces/Satchel';
import mutator from './mutator';

type ActionMessageWithArgs<T extends any[]> = ActionMessage & { args: T };

export function createMutatorActionFactory(
    action: Satchel['action'],
    register: Satchel['register']
) {
    return function mutatorAction<TFunction extends ActionCreator<any>>(
        actionType: string,
        target: MutatorActionTarget<TFunction>
    ) {
        const simpleActionCreator = action(actionType, (...args: Parameters<TFunction>) => {
            return {
                args,
            };
        });

        const mutatorTarget = (
            actionMessage: ActionMessageWithArgs<Parameters<TFunction>>
        ): void => {
            return target(...actionMessage.args);
        };

        register(mutator(simpleActionCreator, mutatorTarget));

        return simpleActionCreator;
    };
}
