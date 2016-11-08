import { ObservableMap, isObservableMap } from 'mobx';
import rootStore from './rootStore';

export interface CursorSelector {
    (store: any): any;
}

function createCursorObject(selector: CursorSelector, subStore?: any) {
    let selected = selector(subStore || rootStore);
    let cursorObj: any = function() {};

    Object.keys(selected).forEach((key) => {
        let path = selected[key].split('.');
        let segments = path.length - 1;
        let obj: any = subStore || rootStore;

        for (var i = 0; i < segments; i++) {
            if (isObservableMap(obj)) {
                obj = obj.get(path[i]);
            } else {
                obj = obj[path[i]];
            }
        }

        Object.defineProperty(cursorObj, key, {
            get: function() {
                if (isObservableMap(obj)) {
                    return obj.get(key);
                }
                
                return Object.getOwnPropertyDescriptor(obj, path[path.length - 1]).get();
            },

            set: function(value) {
                if (isObservableMap(obj)) {
                    return obj.set(key, value);
                }

                return Object.getOwnPropertyDescriptor(obj, path[path.length - 1]).set(value);
            }
        });
    });

    return cursorObj;
}

export default function cursor(selector: CursorSelector, subStore?: any) {
    return function decorator<T extends Function>(target: T): T {
        let _this = this;

        let returnValue: any = function() {
            [].push.call(arguments, createCursorObject(selector, subStore));
            return target.apply(_this, arguments);
        }

        return <T>returnValue;
    }
}
