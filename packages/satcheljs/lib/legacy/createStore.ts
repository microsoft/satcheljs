import rootStore from '../rootStore';
import action from './action';

let internalCreateStore =
    function internalCreateStore(key: string, initialState: any) {
        rootStore.set(key, initialState);
    };

internalCreateStore = <any>action("createStore")(internalCreateStore);

export default function createStore<T>(key: string, initialState: T): T {
    internalCreateStore(key, initialState);
    return <T>rootStore.get(key);
};
