import { action } from 'mobx';
import getRootStore from './getRootStore';

let createStoreAction = action('createStore', function createStoreAction(
    key: string,
    initialState: any
) {
    getRootStore().set(key, initialState);
});

export default function createStoreSelector<T>(key: string, initialState: T): () => T {
    createStoreAction(key, initialState);
    return () => <T>getRootStore().get(key);
}
