import { action } from 'mobx';
import getRootStore from './getRootStore';
import { simpleMutator } from './simpleSubscribers';

// initializeState can be used to completely replace the existing state object, e.g. to restore
// the stores from a serialized value or to provide a clean starting state for test cases.
export default action('initializeState', function initializeState(initialState: {
    [key: string]: any;
}) {
    let rootStore = getRootStore();

    rootStore.clear();
    rootStore.merge(initialState);
});
