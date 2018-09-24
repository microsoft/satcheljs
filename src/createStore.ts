import { action } from 'mobx';
import getRootStore from './getRootStore';
import CombinedMutator from './CombinedMutator';
import LeafMutator from './LeafMutator';
import { subscribeAll } from './dispatcher';
import wrapMutator from './wrapMutator';

let createStoreAction = action('createStore', function createStoreAction(
    key: string,
    initialState: any
) {
    getRootStore().set(key, initialState);
});

export default function createStore<TState>(
    key: string,
    arg2: TState | LeafMutator<TState> | CombinedMutator<TState>
): () => TState {
    // Get the initial state (from the mutator, if necessary)
    let mutator = getMutator(arg2);
    let initialState = mutator ? mutator.getInitialValue() : arg2;

    // Create the store under the root store
    createStoreAction(key, initialState);
    let getStore = () => <TState>getRootStore().get(key);

    // If necessary, hook the mutator up to the dispatcher
    if (mutator) {
        subscribeAll(
            wrapMutator(actionMessage => {
                mutator.handleAction(getStore(), actionMessage, newState => {
                    getRootStore().set(key, newState);
                });
            })
        );
    }

    return getStore;
}

function getMutator<TState>(mutator: TState | LeafMutator<TState> | CombinedMutator<TState>) {
    if ((<any>mutator).handleAction) {
        return <LeafMutator<TState> | CombinedMutator<TState>>mutator;
    }

    return null;
}
