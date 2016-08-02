import 'jasmine';
import initialize from '../src/initialize';

declare var global: any;

describe("initialize", () => {
    beforeEach(() => {
        delete global._isSatchelJsLoaded;
    });

    it("passes the first time it is called", () => {
        initialize();
    });

    it("throws if called multiple times", () => {
        expect(() => {
            initialize();
            initialize();
        })
        .toThrow();
    });
});
