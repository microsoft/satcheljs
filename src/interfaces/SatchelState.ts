import type { ObservableMap } from 'mobx';
import type ActionMessage from './ActionMessage';
import type SubscriberFunction from './SubscriberFunction';

type SatchelState = {
    __rootStore: ObservableMap<any>;
    __nextActionId: number;
    __subscriptions: { [key: string]: SubscriberFunction<ActionMessage, any>[] };
    __currentMutator: string | null;
};

export default SatchelState;
