import './setupJsdom';
import 'jasmine';

import * as React from 'react';

import { action, createStore, initializeTestMode, resetTestMode } from '../../../src';
import { mount, shallow } from 'enzyme';

import { isObservable } from 'mobx';
import reactive from '../../../src/legacy/react/reactive';

let sequenceOfEvents: any[];

describe('reactive decorator', () => {
    it('observes changes from store', () => {
        let store = createStore('testStore', {
            foo: 'value',
        });

        let renderSpy = jasmine.createSpy(null);

        let Wrapped = reactive({
            foo: () => store.foo,
        })(
            class extends React.Component<any, any> {
                render() {
                    let { foo } = this.props;
                    renderSpy();
                    return (
                        <div className="testClass">
                            {foo}
                        </div>
                    );
                }
            }
        );

        let wrapper = mount(<Wrapped />);

        action('dummy')(() => {
            store.foo = 'hello';
        })();

        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(wrapper.find('.testClass').text()).toBe('hello');
    });

    it('passes through to @observer if no args are passed', () => {
        let store = createStore('testStore', {
            foo: 'value',
        });

        let TestComponent = reactive(
            class extends React.Component<any, any> {
                componentWillMount() {}
                render() {
                    return (
                        <div>
                            {store.foo}
                        </div>
                    );
                }
            }
        );

        let component = new TestComponent({ hello: 'world' });
        component.componentWillMount();
        component.render();

        expect(isObservable(component.render)).toBeTruthy();
    });

    it('creates a mountable classical component', () => {
        let store = createStore('testStore', {
            foo: 'value',
        });

        let Wrapped = reactive({
            foo: () => store.foo,
        })(
            class extends React.Component<any, any> {
                render() {
                    let { foo, hello } = this.props;
                    expect(foo).toBe(store.foo);
                    expect(hello).toBe('world');
                    return (
                        <div className="testClass">
                            {foo}
                        </div>
                    );
                }
            }
        );

        expect(mount(<Wrapped hello="world" />).find('.testClass').length).toBe(1);
    });

    it('injects subtree as props for classical components', () => {
        let store = createStore('testStore', {
            foo: 'value',
        });

        @reactive({
            foo: () => store.foo,
        })
        class TestComponent extends React.Component<any, any> {
            render() {
                let { foo, hello } = this.props;
                expect(foo).toBe(store.foo);
                expect(hello).toBe('world');
                return (
                    <div>
                        {foo}
                    </div>
                );
            }
        }

        let comp = new TestComponent({ hello: 'world' });
        comp.render();
    });

    it('allows classical components to be tested in a pure manner', () => {
        let store = createStore('testStore', {
            foo: null,
        });

        @reactive({
            foo: () => store.foo,
        })
        class TestComponent extends React.Component<any, any> {
            render() {
                let { foo } = this.props;

                expect(foo).toBe('somevalue');

                return (
                    <div>
                        {foo}
                    </div>
                );
            }
        }

        let comp = new TestComponent({ foo: 'somevalue' });
        comp.render();
    });

    it('allows functional components to be tested in a pure manner', () => {
        let store = createStore('testStore', {
            foo: null,
        });

        let TestComponent = reactive({
            foo: () => store.foo,
        })((props: any) => {
            let { foo, hello } = props;
            expect(foo).toBe('world');
            return (
                <div>
                    {foo}
                </div>
            );
        });

        TestComponent.nonReactiveStatelessComponent({ foo: 'world' });

        let comp = new TestComponent({ foo: 'world' });
        comp.render();

        expect(store.foo).toBeNull();
    });

    it('creates a mountable functional component', () => {
        let store = createStore('testStore', {
            foo: 'value',
        });

        let Wrapped = reactive({
            foo: () => store.foo,
        })((props: any) => {
            let { foo, hello } = props;
            expect(foo).toBe('value');
            expect(hello).toBe('world');
            return (
                <div className="testClass">
                    {foo}
                </div>
            );
        });

        expect(mount(<Wrapped hello="world" />).find('.testClass').length).toBe(1);
    });

    it('injects subtree as props for functional components', () => {
        let store = createStore('testStore', {
            foo: 'value',
        });

        let TestComponent = reactive({
            foo: () => store.foo,
        })((props: any) => {
            let { foo, hello } = props;
            expect(foo).toBe(store.foo);
            expect(hello).toBe('world');
            return (
                <div>
                    {foo}
                </div>
            );
        });

        // Reactive stateless component are converted to classical components by @observer
        let comp = new TestComponent({ hello: 'world' });
        comp.render();
    });

    it('injects props as param to the selector functions', () => {
        let store: any = createStore('testStore', {
            id0: 'value',
        });

        let TestComponent = reactive({
            foo: (p: any) => store[p.id],
        })((props: any) => {
            let { foo } = props;
            expect(foo).toBe('value');
            return (
                <div>
                    {foo}
                </div>
            );
        });

        // Reactive stateless component are converted to classical components by @observer
        let comp = new TestComponent({ id: 'id0' });
        comp.render();
    });

    it('decorates over component classes with public members', () => {
        @reactive
        class TestComponent extends React.Component<any, any> {
            foo: string;

            bar() {}

            render() {
                let { foo } = this.props;
                expect(foo).toBe('somevalue');
                return (
                    <div>
                        {foo}
                    </div>
                );
            }
        }

        let comp = new TestComponent({ foo: 'somevalue' });
        comp.render();
    });

    it('allows for type checking for generic decorator with TS 2.1', () => {
        let store = createStore('testStore', {
            foo: 'value',
            dontuse: 2,
        });

        interface Props {
            foo: string;
            bar: string;
        }

        @reactive<Props>({
            foo: () => store.foo,
        })
        class TestComponent extends React.Component<Props, any> {
            render() {
                let { foo, bar } = this.props;
                expect(foo).toBe('value');
                return (
                    <div>
                        {foo}
                    </div>
                );
            }
        }
    });

    it('does not execute the selector function in test mode', () => {
        initializeTestMode();

        let fooSelector = jasmine.createSpy(null);
        let TestComponent = reactive({
            foo: fooSelector,
        })(
            class extends React.Component<any, any> {
                render() {
                    return <div />;
                }
            }
        );

        shallow(<TestComponent />);

        expect(fooSelector).not.toHaveBeenCalled();

        resetTestMode();
    });

    it('does execute the selector function after test mode has been cleared', () => {
        initializeTestMode();
        resetTestMode();

        let fooSelector = jasmine.createSpy(null);
        let TestComponent = reactive({
            foo: fooSelector,
        })(
            class extends React.Component<any, any> {
                render() {
                    return <div />;
                }
            }
        );

        shallow(<TestComponent />);

        expect(fooSelector).toHaveBeenCalled();
    });
});
