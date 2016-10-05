import {isObservableArray, ObservableMap, isObservableMap, map} from 'mobx';
import {isPlainObject, isFunction} from './typechecks';
import {SNAPSHOT_OBSERVABLEMAP_TYPE, SNAPSHOT_DATE_TYPE, SNAPSHOT_FUNCTION_TYPE, SNAPSHOT_TYPE_KEY} from './constants';

interface VisitContext {
    visitCache: any[];
    detectCycles: boolean;
}

function cache(source: any, value: any, context: any) {
    if (context.detectCycles) {
        context.visitCache.push([source, value]);
    }

    return value;
}

/* Visitor Pattern */
function visitObservableMap(source: ObservableMap<any>, context: VisitContext) {
    let result: any = {};
    source.forEach(
        (value, key) => result[key] = visit(value, context)
    );

    return { [SNAPSHOT_TYPE_KEY]: SNAPSHOT_OBSERVABLEMAP_TYPE, value: result };
}

function visitDate(source: Date, context: VisitContext) {
    let result: any = {};
    return { [SNAPSHOT_TYPE_KEY]: SNAPSHOT_DATE_TYPE, value: source.getTime() };
}

function visitPlainObject(source: any, context: VisitContext) {
    let result: {[key: string]: any} = {};
    for (let key of Object.keys(source)) {
        if (source.hasOwnProperty(key)) {
            result[key] = visit(source[key], context);
        }
    }

    return result;
}

function visitArray(source: any, context: VisitContext) {
    let result: any[] = [];
    result = source.map((value: any) => visit(value, context));

    return result;
}

function visitFunction(source: any, context: VisitContext) {
    return { [SNAPSHOT_TYPE_KEY]: SNAPSHOT_FUNCTION_TYPE };
}

function visit(source: any, context: VisitContext) {
    let result: any = source;

    // Detect cycles will loop through the visitCache and return the result if found in cache
    if (context.detectCycles && source !== null && typeof source === "object") {
        for (let i = 0, l = context.visitCache.length; i < l; i++) {
            if (context.visitCache[i][0] === source) {
                return context.visitCache[i][1];
            }
        }
    }

    // Do the actual visits
    if (source instanceof Date) {
        result = visitDate(source, context);
    } else if (Array.isArray(source) || isObservableArray(source)) {
        result = visitArray(source, context);
    } else if (isObservableMap(source)) {
        result = visitObservableMap(source, context);
    } else if (isPlainObject(source)) {
        result = visitPlainObject(source, context);
    } else if (isFunction(source)) {
        result = visitFunction(source, context);
    }

    // Cache and return result
    return cache(source, result, context);
}

export default function serialize(source: any, detectCycles: boolean = true): any {
    let context: VisitContext = {
        detectCycles: detectCycles,
        visitCache: []
    };

    return visit(source, context);
}
