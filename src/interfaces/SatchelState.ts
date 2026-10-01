import type { ObservableMap } from 'mobx';
import type ActionMessage from './ActionMessage';
import type Subscriber from './Subscriber';
import type SubscriberFunction from './SubscriberFunction';

type SatchelState = {
    __rootStore: ObservableMap<any>;
    __nextActionId: number;
    __subscriptions: { [key: string]: SubscriberFunction<ActionMessage, any>[] };
    __currentMutator: string | null;
    /**
     * Unique token identifying this satchel instance. Action creators and action messages are
     * stamped with it so they can't be used with a different satchel instance.
     */
    __ownerToken: object;
    // WeakMap rather than WeakSet for ES5 (IE11) compatibility
    __registeredSubscribers: WeakMap<Subscriber<any, any>, true>;
};

export default SatchelState;
