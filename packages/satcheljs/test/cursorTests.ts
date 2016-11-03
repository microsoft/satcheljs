import { ObservableMap } from 'mobx';
import createStore from '../lib/createStore';
import action from '../lib/action';
import cursor from '../lib/cursor';

describe("cursor", () => {
    it("should allow read access to the state tree", () => {
        createStore("foo", "foo");
        createStore("bar", "bar");
        createStore("baz", {
            hello: {
                world: 'test'
            }   
        });

        interface Cursor1 {
            foo: string;
            bar: string;
            baz: string;
        }

        function someAction(state?: Cursor1) {
            expect(state.foo).toBe("foo");
            expect(state.bar).toBe("bar");
            expect(state.baz).toBe("test");
        }

        let someActionDecorated = cursor((store) => ({foo: 'foo', bar: 'bar', baz: 'baz.hello.world'}))(someAction);

        someActionDecorated();
    });

    it("should allow write access to the state tree", () => {
        var fooStore = createStore("foo", { key1: "value1" });

        interface Cursor1 {
            key1: string;
        }

        function someAction(state?: Cursor1) {
            state.key1 = "value2";
        }

        let selector = (store: any) => ({ key1: 'foo.key1' });
        let someActionDecorated = action("someAction")(cursor(selector)(someAction));
        someActionDecorated();
        expect(fooStore.key1).toBe("value2");
    });
});