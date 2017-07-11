import rootStore from './rootStore';
import { simpleMutator } from './simpleSubscribers';

<<<<<<< HEAD:src/createStore.ts
let createStoreAction = simpleAction('createStore', function createStoreAction(
    key: string,
    initialState: any
) {
    rootStore.set(key, initialState);
});
=======
let createStoreAction = simpleMutator("createStore",
    function createStoreAction(key: string, initialState: any) {
        rootStore.set(key, initialState);
    });
>>>>>>> vnext:packages/satcheljs/lib/createStore.ts

export default function createStore<T>(key: string, initialState: T): T {
    createStoreAction(key, initialState);
    return <T>rootStore.get(key);
}
