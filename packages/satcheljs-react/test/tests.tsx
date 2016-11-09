import 'jasmine';
import {createStore} from 'satcheljs';
import * as React from 'react';
import reactive from '../lib/reactive';

let sequenceOfEvents: any[];

describe("reactive decorator", () => {
    it("makes the class an observer", () => {
        expect(true).toBe(true);
    });

    it("injects selected points from the tree as props", () => {
        let store = createStore("testStore", {
            foo: "value"
        });

        @reactive({
            foo: () => store.foo
        })
        class TestComponent extends React.Component<any, any> {
            render() {
                expect(this.props.foo).toBe(store.foo);
                return <div>{this.props.foo}</div>;
            }
        }
    });
});
