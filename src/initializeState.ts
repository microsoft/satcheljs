import rootStore from './rootStore';
import { simpleMutator } from './simpleSubscribers';

// initializeState can be used to completely replace the existing state object, e.g. to restore
// the stores from a serialized value or to provide a clean starting state for test cases.
export default simpleMutator("initializeState",
    function initializeState(initialState: { [key: string]: any }) {
        rootStore.clear();
        rootStore.merge(initialState);
    });
