import 'jasmine';
import { observable, map, isObservableMap } from 'mobx';
import { action } from 'satcheljs';
import reconcile from '../lib/reconcile';

describe("reconcile", () => {
    it("handles nested plain object value changes", () => {
        let source = {root: {foo: 1}};
        let target = {root: {foo: 3}};

        action("reconcile")(() => {
            reconcile(source, target);
        })();

        expect(source.root.foo).toBe(3);
    });

    it("handles nested plain object type change", () => {
        let source = {root: {foo: 1}};
        let target = {root: "234"};

        action("reconcile")(() => {
            reconcile(source, target);
        })();

        expect(source.root).toBe("234");
    });

    it("handles observable map changes in a value", () => {
        let source = map({root: {foo: 1}});
        let target = map({root: {foo: "234"}});

        action("reconcile")(() => {
            reconcile(source, target);
        })();

        expect(source.get("root").foo).toBe("234");
    });

    it("handles nested observable map changes in a value", () => {
        let source = map({root: map(<any>{foo: 1, bar: "retained", isFlag: false})});
        let target = map({root: map(<any>{foo: "234", bar: "retained", isFlag: false})});

        action("reconcile")(() => {
            reconcile(source, target);
        })();

        expect(source.get("root").get("foo")).toBe("234");
        expect(source.get("root").get("bar")).toBe("retained");
        expect(source.get("root").get("isFlag")).toBe(false);
    });

    it("handles nested observable map changes types", () => {
        let source = map({root: {foo: 1}});
        let target = map({root: "234"});

        action("reconcile")(() => {
            reconcile(source, target);
        })();

        expect(source.get("root")).toBe("234");
    });

     it("handles array changes", () => {
        let source = [1, 2, 3, 4];
        let target = [1, 2, 3, 4, 5];

        action("reconcile")(() => {
            reconcile(source, target);
        })();

        expect(source.length).toBe(5);
        expect(JSON.stringify(source)).toBe(JSON.stringify(target));
    });

    it("handles array changes with observable maps", () => {
        let source: any[] = [1, 2, 3, map({foo: 1})];
        let target = [1, 2, 3, map({foo: 2})];

        action("reconcile")(() => {
            reconcile(source, target);
        })();

        expect(source.length).toBe(4);
        expect(source[3].get("foo")).toBe(2);
    });

    it("handles array changes of different types", () => {
        let source: any[] = [1, 2, 3, 4];
        let target = [1, 2, 3, map({foo: 2})];

        action("reconcile")(() => {
            reconcile(source, target);
        })();

        expect(source.length).toBe(4);
        expect(source[3].get("foo")).toBe(2);
    });
});
