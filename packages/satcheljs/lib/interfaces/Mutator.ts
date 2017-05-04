import ActionMessage from './ActionMessage';

interface Mutator {
    (actionMessage: ActionMessage): void;
}

export default Mutator;
