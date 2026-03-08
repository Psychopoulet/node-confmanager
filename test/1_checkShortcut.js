// deps

    // natives
    const { join } = require("node:path");
    const { throws, strictEqual } = require("node:assert");

    // locals
    const checkShortcut = require(join(__dirname, "..", "lib", "cjs", "utils", "checkShortcut.js")).default;

// tests

describe("checkShortcut", () => {

    it("should test inexistant data", () => {

        throws(() => {
            checkShortcut();
        }, "inexistant data does not throws an error");

        throws(() => {
            checkShortcut("test");
        }, "inexistant data does not throws an error");

    });

    it("should test wrong type data", () => {

        throws(() => {
            checkShortcut(false);
        }, "inexistant data does not throws an error");

        throws(() => {
            checkShortcut("test", false);
        }, "inexistant data does not throws an error");

    });

    it("should test empty data", () => {

        throws(() => {
            checkShortcut("");
        }, "inexistant data does not throws an error");

        throws(() => {
            checkShortcut("test", "");
        }, "inexistant data does not throws an error");

    });

    it("should test wrong-formated data", () => {

        const { key, shortkey } = checkShortcut("test ", "TEST");

        strictEqual(typeof key, "string", "wrong-formated data does not generate valid data");
        strictEqual(key, "test", "wrong-formated data does not generate valid data");

        strictEqual(typeof shortkey, "string", "wrong-formated data does not generate valid data");
        strictEqual(shortkey, "test", "wrong-formated data does not generate valid data");

    });

    it("should test good data", () => {

        const { key, shortkey } = checkShortcut("test", "test");

        strictEqual(typeof key, "string", "wrong-formated data does not generate valid data");
        strictEqual(key, "test", "wrong-formated data does not generate valid data");

        strictEqual(typeof shortkey, "string", "wrong-formated data does not generate valid data");
        strictEqual(shortkey, "test", "wrong-formated data does not generate valid data");

    });

});
