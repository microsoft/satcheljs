import 'jasmine';
import { isObservableMap } from 'mobx';
import rootStore from '../../src/rootStore';

describe("rootStore", () => {
    it("is an ObservableMap", () => {
        expect(isObservableMap(rootStore)).toBeTruthy();
    });
});
