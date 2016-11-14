import {observer} from 'mobx-react';
import * as React from 'react';
import {SelectorFunction} from 'satcheljs/lib/select';

export interface ReactiveTarget extends React.ClassicComponentClass<any> {
    nonReactiveComponent?: React.ComponentClass<any>,
    nonReactiveStatelessComponent?: React.StatelessComponent<any>
};

function setPropAccessors(props: any, selector: SelectorFunction) {
    Object.keys(selector).forEach(key => {
        let getter = selector[key];

        if (typeof props[key] === typeof undefined) {
            Object.defineProperty(props, key, {
                get: () => getter.call(null, props)
            });
        }
    });
}

function createNewConstructor(target: React.ComponentClass<any>, selector: SelectorFunction) {
    if (!selector) {
        return target;
    }

    var original = target;
    var newTarget : any = function (props?: any) {
        setPropAccessors(props, selector);
        return original.call(this, props)
    }

    // copy prototype so intanceof operator still works
    newTarget.prototype = original.prototype;
    return newTarget;
}

function createNewFunctionalComponent(target: React.StatelessComponent<any>, selector: SelectorFunction) {
    if (!selector) {
        return target;
    }

    return function(props: any) {
        setPropAccessors(props, selector);
        return target.call(target, props);
    };
}

/**
 * Reactive decorator
 */
export default function reactive(selector?: SelectorFunction) {
    return function<T extends React.ReactType>(target: T) {
        let newComponent: any;

        if ((target as any).prototype instanceof React.Component) {
            newComponent = createNewConstructor(observer(target as React.ComponentClass<any>), selector);
            newComponent.nonReactiveComponent = target  as React.ComponentClass<any>;
            return newComponent;
        }

        if (target instanceof Function) {
            newComponent = observer(createNewFunctionalComponent(target as React.StatelessComponent<any>, selector));
            newComponent.nonReactiveStatelessComponent = target as React.StatelessComponent<any>;
            return newComponent;
        }

        return <T>newComponent;
    }
}