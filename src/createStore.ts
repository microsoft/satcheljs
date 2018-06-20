import { action } from 'mobx';
import getRootStore from './getRootStore';
import CombinedMutator from './CombinedMutator';
import Mutator from './Mutator';

let createStoreAction = action('createStore', function createStoreAction(
    key: string,
    initialState: any
) {
    getRootStore().set(key, initialState);
});

export default function createStore<TState>(
    key: string,
    initialStateOrMutator: TState | Mutator<TState> | CombinedMutator<TState>
): () => TState {
    let initialState = initialStateOrMutator;
    let mutator = initialStateOrMutator as Mutator<TState>;
    if (mutator.handleAction && typeof mutator.handleAction == 'function') {
        initialState = mutator.getInitialValue();
    }

    createStoreAction(key, initialState);
    return () => <TState>getRootStore().get(key);
}
