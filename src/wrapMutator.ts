import { action } from 'mobx';
import ActionMessage from './interfaces/ActionMessage';
import MutatorFunction from './interfaces/MutatorFunction';
import { getGlobalContext } from './globalContext';

// Wraps the target function for use as a mutator
export default function wrapMutator<T extends ActionMessage>(
    target: MutatorFunction<T>
): MutatorFunction<T> {
    // Wrap the target in a MobX action so it can modify the store
    return action((actionMessage: T) => {
        try {
            getGlobalContext().inMutator = true;
            if (target(actionMessage)) {
                throw new Error('Mutators cannot return a value and cannot be async.');
            }
        } finally {
            getGlobalContext().inMutator = false;
        }
    });
}
