import 'jasmine';
import { observable, map, isObservableMap } from 'mobx';
import deserialize from '../lib/deserialize';
import serialize from '../lib/serialize';

describe("deserialize", () => {
    it("deserializes observable array to itself", () => {
        let observableArray = observable([1, 2]);
        let output = deserialize(observableArray);
        expect(output[0]).toBe(1);
        expect(output[1]).toBe(2);
        expect(output.length).toBe(2);
    });

    it("deserializes array to itself", () => {
        let regularArray = [1, 2];
        let output = deserialize(regularArray);
        expect(output[0]).toBe(1);
        expect(output[1]).toBe(2);
        expect(output.length).toBe(2);
    });

    it("deserializes observable maps", () => {
        let obj = map({foo: 5});
        let serialized = serialize(obj);
        let output = deserialize(serialized);

        expect(isObservableMap(output)).toBeTruthy();
        expect(output.get("foo")).toBe(5);
    });

    it("deserializes objects", () => {
        let obj = {foo: 5, bar: 6};
        let output = deserialize(obj);

        expect(isObservableMap(output)).toBe(false);
        expect(output.foo).toBe(5);
        expect(output.bar).toBe(6);
    });

    it("deserializes nested observable maps", () => {
        let obj = map({bar: map({id0: 4, id1: 3})});
        let serialized = serialize(obj);
        let output = deserialize(serialized);

        expect(isObservableMap(output)).toBeTruthy();
        expect(output.get("bar").get("id0")).toBe(4);
        expect(output.get("bar").get("id1")).toBe(3);
    });

    it("deserializes null", () => {
        let output = deserialize(null);
        expect(null).toBeNull();
    });

    it("deserializes date", () => {
        let date = new Date();
        let serialized = serialize({date: date});
        let deserialized = deserialize(serialized);
        expect(deserialized.date.getTime()).toBe(date.getTime());
    });

    it("deserializes scalar values", () => {
        expect(deserialize(3.14)).toBe(3.14);
        expect(deserialize("a")).toBe("a");
    });

    it("deserializes functions into nulls", () => {
        let obj = {bar: function() {}};
        let serialized = serialize(obj);
        let output = deserialize(serialized);

        expect(output.bar).toBeNull();
    });
});
