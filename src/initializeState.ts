import rootStore from './rootStore';
import { simpleMutator } from './simpleSubscribers';

// initializeState can be used to completely replace the existing state object, e.g. to restore
// the stores from a serialized value or to provide a clean starting state for test cases.
<<<<<<< HEAD:src/initializeState.ts
export default simpleAction('initializeState', function initializeState(initialState: {
    [key: string]: any;
}) {
    rootStore.clear();
    rootStore.merge(initialState);
});
=======
export default simpleMutator("initializeState",
    function initializeState(initialState: { [key: string]: any }) {
        rootStore.clear();
        rootStore.merge(initialState);
    });
>>>>>>> vnext:packages/satcheljs/lib/initializeState.ts
