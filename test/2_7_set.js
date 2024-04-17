// deps

    // natives
    const { join } = require("node:path");
    const assert = require("node:assert");

    // locals
    const NodeConfManager = require(join(__dirname, "..", "lib", "cjs", "main.cjs"));

// consts

    const CONF_FILE = join(__dirname, "conf.json");

// tests

describe("set", () => {

    const conf = new NodeConfManager(CONF_FILE, true);

    before(() => {

        conf.clear();

        return conf.deleteFile();

    });

    after(() => {

        conf.clear();

        return conf.deleteFile();

    });

    it("should set a value", () => {

        assert.throws(() => {
            conf.set(15);
        }, Error, "check type value does not throw an error");

    });

});
