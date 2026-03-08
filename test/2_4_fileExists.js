// deps

    // natives
    const { join } = require("node:path");
    const { strictEqual, ok } = require("node:assert");

    // locals
    const NodeConfManager = require(join(__dirname, "..", "lib", "cjs", "main.cjs"));

// consts

    const CONF_FILE = join(__dirname, "conf.json");

// tests

describe("fileExists", () => {

    after(() => {

        const conf = new NodeConfManager(CONF_FILE);

        conf.clear();

        return conf.deleteFile();

    });

    it("should check file existance without file", () => {

        return new NodeConfManager().fileExists().then((exists) => {
            strictEqual(exists, false, "check file existance failed");
        });

    });

    it("should check file existance with file", () => {

        return new NodeConfManager(CONF_FILE).fileExists().then((exists) => {
            strictEqual(exists, false, "check file existance failed");
        });

    });

    it("should check file existance with saved file", () => {

        const Conf = new NodeConfManager(CONF_FILE);

        return Conf.save().then(() => {

            return Conf.fileExists().then((exists) => {
                ok(exists);
            });

        });

    });

});
