import {isObservableArray, ObservableMap, isObservableMap, map} from 'mobx';
import {isPlainObject} from './typechecks';
import {SNAPSHOT_OBSERVABLEMAP_TYPE, SNAPSHOT_DATE_TYPE, SNAPSHOT_TYPE_KEY, SNAPSHOT_FUNCTION_TYPE} from './constants';

function deserializeMap(source: any): ObservableMap<any> {
    return map(deserialize(source.value))
}

// Cannot deserialize functions, simply return null
function deserializeFunction(source: any): any {
    return null;
}

function deserializeDate(source: any): Date {
    return new Date(source.value);
}

export default function deserialize(source: any): any {
    if (!source) {
        return source;
    }

    if (source[SNAPSHOT_TYPE_KEY]) {
        if (source[SNAPSHOT_TYPE_KEY] == SNAPSHOT_OBSERVABLEMAP_TYPE) {
            source = deserializeMap(source);
        } else if (source[SNAPSHOT_TYPE_KEY] == SNAPSHOT_FUNCTION_TYPE) {
            source = deserializeFunction(source);
        } else if (source[SNAPSHOT_TYPE_KEY] == SNAPSHOT_DATE_TYPE) {
            source = deserializeDate(source);
        }
    } else if (Array.isArray(source)) {
        source = source.map((value: any, index: number) => {
            return deserialize(value);
        });
    } else if (isPlainObject(source)) {
        for (let key of Object.keys(source)) {
            if (source.hasOwnProperty(key)) {
                source[key] = deserialize(source[key]);
            }
        }
    } else if (isObservableMap(source)) {
        source.forEach((value: any, key: string) => {
            source.set(key, deserialize(value));
        });
    }

    return source;
}
