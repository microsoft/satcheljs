import 'jasmine';
import rootStore from '../../src/rootStore';
import initializeState from '../../src/initializeState';

describe("initializeState", () => {
    it("replaces the state value", () => {
        var initialState = { foo: 1 };
        initializeState(initialState);
        expect(rootStore.get("foo")).toEqual(1);
    });
});
