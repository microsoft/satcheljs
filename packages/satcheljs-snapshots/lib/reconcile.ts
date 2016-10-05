import {ObservableMap, isObservableMap} from 'mobx';
import {isPlainObject, isSameType} from './typechecks';

function reconcileObservableMaps(source: ObservableMap<any>, target: ObservableMap<any>) {
    target.forEach((value: any, key: string) => {
        if (source.has(key)) {
            source.set(key, reconcile(source.get(key), target.get(key)));
        } else {
            source.set(key, target.get(key));
        }
    });

    let sourceKeys = source.keys();
    for (let key of sourceKeys) {
        if (!target.has(key)) {
            source.delete(key);
        }
    }

    return source;
}

function reconcilePlainObjects(source: any, target: any) {
    let sourceKeys = Object.keys(source);
    let targetKeys = Object.keys(target);

    // insertions
    for (let targetKey of targetKeys) {
        if (targetKey in source) {
            source[targetKey] = reconcile(source[targetKey], target[targetKey]);
        } else {
            source[targetKey] = target[targetKey];
        }
    }

    // deletions
    for (let sourceKey of sourceKeys) {
        if (!(sourceKey in target)) {
            delete source[sourceKey];
        }
    }

    return source;
}

function reconcileArray(source: any[], target: any[]) {
    for (let i = 0; i < target.length; i++) {
        if (source[i] != target[i]) {
            source[i] = reconcile(source[i], target[i]);
        }
    }

    if (source.length > target.length) {
        source.splice(target.length);
    }

    return source;
}

export default function reconcile(source: any, target: any) {
    if (isSameType(source, target)) {
        if (isObservableMap(source)) {
            return reconcileObservableMaps(source, target);
        } else if (isPlainObject(source)) {
            return reconcilePlainObjects(source, target);
        } else if (Array.isArray(source)) {
            return reconcileArray(source, target);
        } else if (source != target) {
            // same types, but scalar, return target
            return target;
        }

        return source;
    } else {
        // completely different types, return target
        return target;
    }
}
