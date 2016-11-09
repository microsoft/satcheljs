import {observer} from 'mobx-react';
import * as React from 'react';
import {createCursorFromSelector, SelectorFunction} from 'satcheljs/lib/select';

export interface ReactiveTarget extends React.ClassicComponentClass<any> {
    nonReactiveComponent?: React.ComponentClass<any>,
    nonReactiveStatelessComponent?: React.StatelessComponent<any>
};

function createNewConstructor(target: React.ComponentClass<any>, selector: SelectorFunction) {
    if (!selector) {
        return target;
    }

    var original = target;
    var newTarget : any = function (props?: any) {
        createCursorFromSelector(selector, props);
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
        createCursorFromSelector(selector, props);
        return target.call(target, props);
    };
}

export default function reactive(selector?: SelectorFunction) {
    return function(target: React.ReactType) {
        let newComponent: ReactiveTarget;

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

        return newComponent;
    }
}