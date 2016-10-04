import 'jasmine';
import * as GlobalContext from '../src/globalContext';

describe("globalContext", () => {
    beforeEach(() => {
        GlobalContext.__resetGlobalState();
    });

    it("will throw error if the wrong schema version is detected", () => {
        GlobalContext.default.schemaVersion = -999;

        let checker = function() {
            GlobalContext.ensureGlobalContextSchemaVersion();
        };

        expect(checker).toThrow();
    });
});
