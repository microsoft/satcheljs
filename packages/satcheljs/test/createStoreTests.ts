import 'jasmine';
import rootStore from '../lib/rootStore';
import createStore from '../lib/createStore';
import initializeState from '../lib/initializeState';

describe("createStore", () => {
    it("creates a subtree under rootStore", () => {
        // Arrange
        initializeState({});
        let initialState = { testProp: "testValue" };

        // Act
        let store = createStore("testStore", initialState);

        // Assert
        expect(store).toBe(initialState);
        expect(rootStore.get("testStore")).toBe(initialState);
    });
});
