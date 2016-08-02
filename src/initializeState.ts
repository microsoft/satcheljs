import rootStore from './rootStore';
import action from './action';

// initializeState can be used to completely replace the existing state object, e.g. to restore
// the stores from a serialized value or to provide a clean starting state for test cases.
let initializeState =
    function initializeState(initialState: any) {
        rootStore.clear();
        rootStore.merge(initialState);
    };

initializeState = <any>action("initializeState")(initializeState);
export default initializeState;
