import {observer} from 'mobx-react';
import * as React from 'react';
import {SelectorFunction} from 'satcheljs/lib/select';

export interface ReactiveTarget extends React.ClassicComponentClass<any> {
    nonReactiveComponent?: React.ComponentClass<any>,
    nonReactiveStatelessComponent?: React.StatelessComponent<any>
};

function setPropAccessors(props: any, selector: SelectorFunction) {
    let newProps: any = {};

    Object.keys(props).forEach(key => {
        newProps[key] = props[key];
    });

    Object.keys(selector).forEach(key => {
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

function createNewConstructor(target: React.ComponentClass<any>, selector: SelectorFunction): React.ComponentClass<any> | React.Component<any, any> {
    if (!selector) {
        return target;
    }

    var original = target;

    return class extends React.Component<any, any> {
        public wrappedElement: any;
        render() {
            let newProps = setPropAccessors(this.props, selector);
            newProps.ref = (element: any) => {
                this.wrappedElement = element;
            };
            return React.createElement(original, newProps);
        }
    }
}

function createNewFunctionalComponent(target: React.StatelessComponent<any>, selector: SelectorFunction) {
    if (!selector) {
        return target;
    }

    return function(props: any) {
        let newProps = setPropAccessors(props, selector);
        return target.call(target, newProps);
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