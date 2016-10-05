import 'jasmine';
import { observable, map, isObservableMap } from 'mobx';
import serialize from '../lib/serialize';
import { SNAPSHOT_OBSERVABLEMAP_TYPE, SNAPSHOT_DATE_TYPE, SNAPSHOT_FUNCTION_TYPE, SNAPSHOT_TYPE_KEY } from '../lib/constants';

let sequenceOfEvents: any[];

describe("serialize", () => {
    it("serializes observable array to itself", () => {
        let observableArray = observable([1, 2]);
        let output = serialize(observableArray);
        expect(output[0]).toBe(1);
        expect(output[1]).toBe(2);
        expect(output.length).toBe(2);
    });

    it("serializes array to itself", () => {
        let regularArray = [1, 2];
        let output = serialize(regularArray);
        expect(output[0]).toBe(1);
        expect(output[1]).toBe(2);
        expect(output.length).toBe(2);
    });

    it("serializes observable maps", () => {
        let obj = map({foo: 5});
        let output = serialize(obj);
        expect(output[SNAPSHOT_TYPE_KEY]).toBe(SNAPSHOT_OBSERVABLEMAP_TYPE);
        expect(output.value.foo).toBe(5);
    });

    it("serializes objects", () => {
        let obj = {foo: 5, bar: 6};
        let output = serialize(obj);

        expect(isObservableMap(output)).toBe(false);
        expect(output.foo).toBe(5);
        expect(output.bar).toBe(6);
    });

    it("serializes nested observable maps", () => {
        let obj = map({bar: map({id0: 4, id1: 3})});
        let output = serialize(obj);

        expect(output[SNAPSHOT_TYPE_KEY]).toBe(SNAPSHOT_OBSERVABLEMAP_TYPE);
        expect(output.value.bar[SNAPSHOT_TYPE_KEY]).toBe(SNAPSHOT_OBSERVABLEMAP_TYPE);
        expect(output.value.bar.value.id0).toBe(4);
        expect(output.value.bar.value.id1).toBe(3);
    });

    it("will ignore functions inside the state tree", () => {
        let obj = {foo: function() { return 1; }};
        let output = serialize(obj);
        expect(output.foo[SNAPSHOT_TYPE_KEY]).toBe(SNAPSHOT_FUNCTION_TYPE);
    });

    it("serializes dates", () => {
        let date = new Date();
        let output = serialize(date);
        expect(output[SNAPSHOT_TYPE_KEY]).toBe(SNAPSHOT_DATE_TYPE);
    });
});
