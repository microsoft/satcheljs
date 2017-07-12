import 'jasmine';
import rootStore from '../src/rootStore';
import initializeState from '../src/initializeState';
import { __resetGlobalContext } from '../src/globalContext';

describe("initializeState", () => {
    it("replaces the state value", () => {
        // Arrange
        __resetGlobalContext();
        var initialState = { testStore: 1 };

        // Act
        initializeState(initialState);

        // Assert
        expect(rootStore.get("testStore")).toEqual(1);
    });
});
