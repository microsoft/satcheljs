import 'jasmine';
import { isObservableMap } from 'mobx';
import {
    __resetGlobalContext,
    getGlobalContext,
    ensureGlobalContextSchemaVersion,
} from '../src/globalContext';

declare var global: any;

var backupConsoleError = console.error;

describe('globalContext', () => {
    beforeEach(() => {
        __resetGlobalContext();
    });

    it('will throw error if the wrong schema version is detected', () => {
        getGlobalContext().schemaVersion = -999;

        let checker = function() {
            ensureGlobalContextSchemaVersion();
        };

        expect(checker).toThrow();
    });

    it('rootStore is an ObservableMap', () => {
        let rootStore = getGlobalContext().rootStore;
        expect(isObservableMap(rootStore)).toBeTruthy();
    });
});
