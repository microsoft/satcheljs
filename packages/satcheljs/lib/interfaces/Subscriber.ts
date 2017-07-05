import ActionMessage from './ActionMessage';

type Subscriber<T extends ActionMessage> = (actionMessage: T) => void;
export default Subscriber;
