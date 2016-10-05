import {rootStore, initializeState, action} from 'satcheljs';
import {isObservableArray, ObservableMap, isObservableMap, map} from 'mobx';
import {isPlainObject, isSameType} from './typechecks';
import reconcile from './reconcile';
import deserialize from './deserialize';
import {SNAPSHOT_OBSERVABLEMAP_TYPE, SNAPSHOT_TYPE_KEY, SNAPSHOT_FUNCTION_TYPE} from './constants';

let importSnapshot = <any>action("deserialize")(
    function importSnapshot(snapshot: {[index: string]: any}) {
        reconcile(rootStore, deserialize(snapshot));
    }
);

export default importSnapshot;
