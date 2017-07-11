import 'jasmine';
import rootStore from '../src/rootStore';
import createStore from '../src/createStore';
import initializeState from '../src/initializeState';

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
