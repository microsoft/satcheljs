import 'jasmine';
import { isObservableMap } from 'mobx';
import rootStore from '../../lib/legacy/rootStore';

describe("rootStore", () => {
    it("is an ObservableMap", () => {
        expect(isObservableMap(rootStore)).toBeTruthy();
    });
});
