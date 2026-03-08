// deps

    // natives
    const { join } = require("node:path");
    const { throws, ok } = require("node:assert");

    // locals
    const NodeConfManager = require(join(__dirname, "..", "lib", "cjs", "main.cjs"));

// consts

    const CONF_FILE = join(__dirname, "conf.json");

// tests

describe("shortcut", () => {

    const conf = new NodeConfManager(CONF_FILE);

    before(() => {

        conf.clear();

        return conf.deleteFile();

    });

    beforeEach(() => {
        conf.clear();
    });

    after(() => {

        conf.clear();

        return conf.deleteFile();

    });

    it("should test wrong binds", () => {

        throws(() => {
            conf.shortcut(false, "t");
        }, Error, "check type value does not throw an error");

        throws(() => {
            conf.shortcut("", "t");
        }, Error, "check type value does not throw an error");

    });

    it("should bind shortcut", () => {

        ok(
            conf.set("test", "test").shortcut("test", "t") instanceof NodeConfManager
        );

        ok(
            conf.set("test", "test").shortcut("TEST", "T") instanceof NodeConfManager
        );

    });

});
