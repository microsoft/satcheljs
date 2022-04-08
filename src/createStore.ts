import { action } from 'mobx';
import getRootStore from './getRootStore';
import { getGlobalContext } from './globalContext';

let createStoreAction = action('createStore', function createStoreAction(
    key: string,
    initialState: any
) {
    if (getRootStore().get(key)) {
        throw new Error(`A store named ${key} has already been created.`);
    }

    const globalContext = getGlobalContext();
    const newStore = globalContext.createStoresAsClasses
        ? createClass(globalContext.storeClassPrefix + key, initialState)
        : initialState;
    getRootStore().set(key, newStore);
});

export default function createStore<T>(key: string, initialState: T): () => T {
    createStoreAction(key, initialState);
    return () => <T>getRootStore().get(key);
}

function createClass<T>(name: string, initialState: T): T {
    try {
        const Constructor = new Function(`return function ${name}(){ };`)();
        return Object.assign(new Constructor(), initialState);
    } catch {
        return initialState;
    }
}
