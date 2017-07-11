import rootStore from './rootStore';
import { simpleMutator } from './simpleSubscribers';

let createStoreAction = simpleMutator("createStore",
    function createStoreAction(key: string, initialState: any) {
        rootStore.set(key, initialState);
    });

export default function createStore<T>(key: string, initialState: T): T {
    createStoreAction(key, initialState);
    return <T>rootStore.get(key);
}
