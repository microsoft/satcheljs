import 'jasmine';
import { __resetGlobalContext, getGlobalContext, ensureGlobalContextSchemaVersion } from '../../lib/legacy/globalContext';

declare var global: any;

var backupConsoleError = console.error;

describe("globalContext", () => {
    beforeEach(() => {
        __resetGlobalContext();
    });

    beforeAll(() => {
        // Some of these tests cause MobX to write to console.error, so we need to supress that output
        console.error = (message: any): void => null;
    });

    afterAll(() => {
        console.error = backupConsoleError;
    });

    it("will throw error if the wrong schema version is detected", () => {
        getGlobalContext().schemaVersion = -999;

        let checker = function() {
            ensureGlobalContextSchemaVersion();
        };

        expect(checker).toThrow();
    });
});
