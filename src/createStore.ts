import { action as mobxAction } from 'mobx';
import type SatchelState from './interfaces/SatchelState';

export function createStoreFactory(state: SatchelState) {
    const createStoreAction = mobxAction(
        'createStore',
        function createStoreAction(key: string, initialState: any) {
            if (state.rootStore.get(key)) {
                throw new Error(`A store named ${key} has already been created.`);
            }

            state.rootStore.set(key, initialState);
        }
    );

    return function createStore<T>(key: string, initialState: T): () => T {
        createStoreAction(key, initialState);
        return () => <T>state.rootStore.get(key);
    };
}
