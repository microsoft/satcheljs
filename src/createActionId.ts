import { getGlobalContext } from './globalContext';

export default function createActionId(): string {
    return (getGlobalContext().nextActionId++).toString();
}
