import 'jasmine';
import rootStore from '../../lib/rootStore';
import initializeState from '../../lib/initializeState';

describe("initializeState", () => {
    it("replaces the state value", () => {
        var initialState = { foo: 1 };
        initializeState(initialState);
        expect(rootStore.get("foo")).toEqual(1);
    });
});
