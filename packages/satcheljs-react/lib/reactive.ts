import {observer} from 'mobx-react';
import * as React from 'react';
import {SelectorFunction} from 'satcheljs/lib/select';
import {getGlobalContext} from 'satcheljs/lib/globalContext';

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
    }
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
    return target.prototype instanceof React.Component;
}

function isFunction(target: any) {
    return target instanceof Function;
}

/**
 * Reactive decorator
 */
export default function reactive<T>(selectorOrComponentClass?: SelectorFunction<T> | React.ComponentClass<any>): any {
    let componentClass = selectorOrComponentClass as React.ComponentClass<any>;

    // this check only applies to ES6 React Class Components
    if (componentClass && componentClass.prototype && componentClass.prototype.isReactComponent) {
        return observer(componentClass);
    }

    return function<Target extends React.ReactType>(target: Target) {
        if (getGlobalContext().testMode) {
            if (isReactComponent(target)) {
                return observer(target as React.ComponentClass<any>);
            } else if (isFunction(target)) {
                return observer(target as React.StatelessComponent<any>);
            }

            return target;
        }

        let newComponent: any;

        if (isReactComponent(target)) {
            newComponent = createNewConstructor(observer(target as React.ComponentClass<any>), selectorOrComponentClass as SelectorFunction<T>);
            newComponent.nonReactiveComponent = target  as React.ComponentClass<any>;
            return newComponent;
        } else if (isFunction(target)) {
            newComponent = observer(createNewFunctionalComponent(target as React.StatelessComponent<any>, selectorOrComponentClass as SelectorFunction<T>));
            newComponent.nonReactiveStatelessComponent = target as React.StatelessComponent<any>;
            return newComponent;
        }

        return <T>newComponent;
    }
}