import { action } from 'mobx';
import getRootStore from './getRootStore';

let createStoreAction = action('createStore', function createStoreAction(
    key: string,
    initialState: any
) {
    if (getRootStore().get(key)) {
        throw new Error(`A store named ${key} has already been created.`);
    }

    getRootStore().set(key, initialState);
});

export default function createStore<T>(key: string, initialState: T): () => T {
    createStoreAction(key, initialState);
    const store = <T>getRootStore().get(key);
    return () => store;
}
