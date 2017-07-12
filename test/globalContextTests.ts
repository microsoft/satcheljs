import 'jasmine';
import { isObservableMap } from 'mobx';
import {
    __resetGlobalContext,
    getGlobalContext,
    ensureGlobalContextSchemaVersion,
} from '../src/globalContext';

describe('globalContext', () => {
    beforeEach(() => {
        __resetGlobalContext();
    });

    it('will throw error if the wrong schema version is detected', () => {
        // Arrange
        getGlobalContext().schemaVersion = -999;

        // Act / Assert
        expect(ensureGlobalContextSchemaVersion).toThrow();
    });

    it('rootStore is an ObservableMap', () => {
        // Act
        let rootStore = getGlobalContext().rootStore;

        // Assert
        expect(isObservableMap(rootStore)).toBeTruthy();
    });
});
