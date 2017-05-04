import ActionMessage from './ActionMessage';

interface Mutator<T extends ActionMessage> {
    (actionMessage: T): void;
}

export default Mutator;
