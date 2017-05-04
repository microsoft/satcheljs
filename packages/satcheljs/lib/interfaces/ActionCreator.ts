import ActionMessage from './ActionMessage';

interface ActionCreator<T extends ActionMessage> {
    (...args: any[]): T;
}

export default ActionCreator;
