// deps

    // natives
    const { join } = require("node:path");
    const { strictEqual, ok } = require("node:assert");

    // locals
    const isFile = require(join(__dirname, "..", "lib", "cjs", "utils", "isFile.js")).default;

// tests

describe("isFile", () => {

    it("should test missing argument", (done) => {

        isFile().then(() => {
            done(new Error("No error generated"));
        }).catch((err) => {

            strictEqual(typeof err, "object");
            ok(err instanceof ReferenceError);

            done();

        });

    });

    it("should test wrong type argument", (done) => {

        isFile(false).then(() => {
            done(new Error("No error generated"));
        }).catch((err) => {

            strictEqual(typeof err, "object");
            ok(err instanceof TypeError);

            done();

        });

    });

    it("should test empty argument", (done) => {

        isFile("").then(() => {
            done(new Error("No error generated"));
        }).catch((err) => {

            strictEqual(typeof err, "object");
            ok(err instanceof Error);

            done();

        });

    });

    it("should test valid file", () => {

        return isFile(__filename).then((exists) => {

            strictEqual(typeof exists, "boolean");
            ok(exists);

        });

    });

    it("should test invalid file", () => {

        return isFile(__filename + "test").then((exists) => {

            strictEqual(typeof exists, "boolean");
            strictEqual(exists, false);

        });

    });

});
