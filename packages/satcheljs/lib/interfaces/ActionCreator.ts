import ActionMessage from './ActionMessage';

interface ActionCreator {
    (...args: any[]): ActionMessage;
}

export default ActionCreator;
