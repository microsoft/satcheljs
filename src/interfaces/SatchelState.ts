import type { ObservableMap } from 'mobx';
import type ActionMessage from './ActionMessage';
import type Subscriber from './Subscriber';
import type SubscriberFunction from './SubscriberFunction';

type SatchelState = {
    rootStore: ObservableMap<any>;
    /**
     * Subscribers keyed by action ID. An entry is reserved for every action created by this
     * satchel (even before it has subscribers), so membership also indicates ownership.
     */
    subscriptions: Map<string, SubscriberFunction<ActionMessage, any>[]>;
    currentMutator: string | null;
    // WeakMap rather than WeakSet for ES5 (IE11) compatibility
    registeredSubscribers: WeakMap<Subscriber<any, any>, true>;
};

export default SatchelState;
