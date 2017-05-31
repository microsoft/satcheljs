import * as React from 'react';

import {SelectorFunction} from 'satcheljs/lib/legacy/select';
import {getGlobalContext} from 'satcheljs/lib/globalContext';
import {observer} from 'mobx-react';

export interface ReactiveTarget extends React.ClassicComponentClass<any> {
    nonReactiveComponent?: React.ComponentClass<any>,
    nonReactiveStatelessComponent?: React.StatelessComponent<any>
};

function setPropAccessors<T>(props: any, selector: SelectorFunction<T>) {
    let newProps: any = {};

    Object.keys(props).forEach(key => {
        newProps[key] = props[key];
    });

    Object.keys(selector).forEach((key: keyof T) => {
        let getter = selector[key];

        if (typeof newProps[key] === typeof undefined) {
            Object.defineProperty(newProps, key, {
                enumerable: true,
                get: () => getter.call(null, newProps)
            });
        }
    });

    return newProps;
}

function createNewConstructor<T>(original: React.ComponentClass<any>, selector: SelectorFunction<T>): React.ComponentClass<any> | React.Component<any, any> {
    if (!selector) {
        return original;
    }

    return class extends React.Component<any, any> {
        render() {
            return React.createElement(original, setPropAccessors(this.props, selector));
        }
    };
}

function createNewFunctionalComponent<T>(original: React.StatelessComponent<any>, selector: SelectorFunction<T>) {
    if (!selector) {
        return original;
    }

    return function(props: any) {
        let newProps = setPropAccessors(props, selector);
        return original.call(original, newProps);
    };
}

function isReactComponent(target: any) {
    return target && target.prototype && target.prototype.isReactComponent;
}

function isFunction(target: any) {
    return target instanceof Function;
}

/**
 * Reactive decorator
 */
export default function reactive<T>(selectorOrComponentClass?: SelectorFunction<T> | React.ComponentClass<any>): any {
    // this check only applies to ES6 React Class Components
    if (isReactComponent(selectorOrComponentClass)) {
        let componentClass = selectorOrComponentClass as React.ComponentClass<any>;
        return observer(componentClass);
    }

    return function<Target extends React.ReactType>(target: Target) {
        if (getGlobalContext().legacyTestMode) {
            if (isReactComponent(target)) {
                return observer(target as React.ComponentClass<any>);
            } else if (isFunction(target)) {
                return observer(target as React.StatelessComponent<any>);
            }

            return target;
        }

        let newComponent: any;

        if (isReactComponent(target)) {
            // Double layer of observer here so that mobx will flow down the observation
            newComponent = observer(
                createNewConstructor(
                    observer(target as React.ComponentClass<any>),
                    selectorOrComponentClass as SelectorFunction<T>
                ) as React.ComponentClass<any>
            );
            newComponent.nonReactiveComponent = target  as React.ComponentClass<any>;
            return newComponent;
        } else if (isFunction(target)) {
            newComponent = observer(createNewFunctionalComponent(target as React.StatelessComponent<any>, selectorOrComponentClass as SelectorFunction<T>));
            newComponent.nonReactiveStatelessComponent = target as React.StatelessComponent<any>;
            return newComponent;
        }

        return <T>newComponent;
    };
}