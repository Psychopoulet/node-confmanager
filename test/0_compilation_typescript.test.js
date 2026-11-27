// deps

    // natives
    const { exec } = require("node:child_process");
    const { join } = require("node:path");
    const { unlink } = require("node:fs/promises");

// tests

describe("compilation typescript", () => {

    describe("commonjs", () => {

        after(() => {
            return unlink(join(__dirname, "typescript", "compilation.cjs"));
        });

        it("should compile typescript file", () => {

            return new Promise((resolve, reject) => {

                const args = [
                    "bunx tsc",
                    join(__dirname, "typescript", "compilation.cts"),
                    "--target es6",
                    "--module commonjs",
                    "--esModuleInterop",
                    "--ignoreConfig",
                    "--types node"
                ];

                exec(args.join(" "), {
                    "cwd": join(__dirname, ".."),
                    "windowsHide": true
                }, (err) => {
                    return err ? reject(err) : resolve();
                });

            });

        });

        it("should exec compiled typescript file", (done) => {

            const args = [
                "bun",
                join(__dirname, "typescript", "compilation.cjs")
            ];

            exec(args.join(" "), {
                "cwd": join(__dirname, ".."),
                "windowsHide": true
            }, (err) => {
                return err ? done(err) : done();
            });

        });

    });

});
