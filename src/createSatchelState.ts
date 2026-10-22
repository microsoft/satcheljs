import { observable } from 'mobx';
import type SatchelState from './interfaces/SatchelState';

export default function createSatchelState(): SatchelState {
    return {
        rootStore: observable.map({}),
        subscriptions: new Map(),
        currentMutator: null,
        registeredSubscribers: new WeakMap(),
    };
}
