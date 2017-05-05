import ActionMessage from './ActionMessage';

interface Subscriber<T extends ActionMessage> {
    (actionMessage: T): void;
}

export default Subscriber;
