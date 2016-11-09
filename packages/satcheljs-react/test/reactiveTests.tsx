import 'jasmine';
import {createStore, action} from 'satcheljs';
import * as React from 'react';
import reactive from '../lib/reactive';

let sequenceOfEvents: any[];

describe("reactive decorator", () => {
    it("injects subtree as props for classical components", () => {
        let store = createStore("testStore", {
            foo: "value"
        });

        @reactive({
            foo: () => store.foo
        })
        class TestComponent extends React.Component<any, any> {
            render() {
                let {foo, hello} = this.props;
                expect(foo).toBe(store.foo);
                expect(hello).toBe('world');
                return <div>{foo}</div>;
            }
        }

        let comp = new TestComponent({hello: 'world'});
        comp.render();
    });

    it("allows classical components to be tested in a pure manner", () => {
        let store = createStore("testStore", {
            foo: null
        });

        @reactive({
            foo: () => store.foo
        })
        class TestComponent extends React.Component<any, any> {
            render() {
                let {foo} = this.props;

                expect(foo).toBe('somevalue');

                return <div>{foo}</div>;
            }
        }

        let comp = new TestComponent({foo: 'somevalue'});
        comp.render();
    });

    it("allows functional components to be tested in a pure manner", () => {
        let store = createStore("testStore", {
            foo: null
        });

        let TestComponent = reactive({
            foo: () => store.foo
        })((props: any) => {
            let {foo, hello} = props;
            expect(foo).toBe('world');
            return <div>{foo}</div>;
        });

        TestComponent.nonReactiveStatelessComponent({foo: 'world'});

        let comp = new TestComponent({foo: 'world'});
        comp.render();

        expect(store.foo).toBeNull();
    });

    it("injects subtree as props for functional components", () => {
        let store = createStore("testStore", {
            foo: "value"
        });

        let TestComponent = reactive({
            foo: () => store.foo
        })((props: any) => {
            let {foo, hello} = props;
            expect(foo).toBe(store.foo);
            expect(hello).toBe('world');
            return <div>{foo}</div>;
        });

        // Reactive stateless component are converted to classical components by @observer
        let comp = new TestComponent({hello: 'world'});
        comp.render();
    });
});
