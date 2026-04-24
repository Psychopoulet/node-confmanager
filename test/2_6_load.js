// deps

    // natives
    const { join } = require("node:path");
    const { writeFile, unlink } = require("node:fs/promises");
    const { strictEqual, deepStrictEqual, ok } = require("node:assert");

    // locals
    const NodeConfManager = require(join(__dirname, "..", "lib", "cjs", "main.cjs"));
    const clone = require(join(__dirname, "..", "lib", "cjs", "utils", "clone.js")).default;

// consts

    const CONF_FILE = join(__dirname, "conf.json");
    const NO_CONF_FILE = join(__dirname, "2_6_missing_conf.json");
    const PRIO_CONF_FILE = join(__dirname, "2_6_priority_conf.json");

// private

    // methods

        /**
        * Remove mocha's console arguments
        * @param {NodeConfManager} conf : conf to clean
        * @returns {void}
        */
        function _removeMochaConsoleArguments (conf) {

            [
                "extension",
                "reporter",
                "slow",
                "timeout",
                "ui"
            ].forEach((key) => {
                conf.delete(key);
            });

        }

// tests

describe("load", () => {

    it("should load a configuration without file", () => {
        return new NodeConfManager().load({
            "loadEnv": false
        });
    });

    describe("from file", () => {

        const conf = new NodeConfManager(CONF_FILE, true);

        before(() => {

            conf.clear();

            return conf.skeleton("debug", "boolean").deleteFile();

        });

        beforeEach(() => {
            conf.clearData().clearLimits();
        });

        after(() => {

            conf.clear();

            return conf.deleteFile();

        });

        it("should load a configuration with successive promises", () => {

            return conf.fileExists().then((exists) => {

                strictEqual(exists, false, "check file existance failed");

                return conf
                    .set("usr", {
                        "login": "login",
                        "pwd": "pwd"
                    })
                    .set("debug", "n")
                    .set("authors", [ "author1", "author2" ])
                    .save();

            }).then(() => {

                return conf.load({
                    "loadConsole": true,
                    "loadEnv": false
                }).then(() => {
                    _removeMochaConsoleArguments(conf);
                });

            }).then(() => {

                strictEqual(conf.size, 3, "check 'size' loaded data failed");

                deepStrictEqual(conf.get("authors"), [ "author1", "author2" ], "check 'authors' loaded data failed");
                strictEqual(conf.get("debug"), false, "check 'debug' loaded data failed");
                deepStrictEqual(conf.get("usr"), {
                    "login": "login",
                    "pwd": "pwd"
                }, "check 'usr' loaded data failed");

                return conf.fileExists();

            }).then((exists) => {
                ok(exists);
            });

        });

        it("should load a configuration with limit", () => {

            conf.limit("debug", [ true, false ]);

            return conf.load({
                "loadConsole": false,
                "loadEnv": false
            }).catch(() => {
                return Promise.resolve();
            });

        });

    });

    describe("from env file first", () => {

        const conf = new NodeConfManager(CONF_FILE);
        const envFile = join(__dirname, "utils", ".env");

        before(() => {

            conf.clear();

            return conf
                .skeleton("debug", "boolean").shortcut("debug", "d")
                .skeleton("test", "string").shortcut("test", "t").limit("test", [ "test", "test2" ])
                .skeleton("plugins", "array");

        });

        beforeEach(() => {
            conf.clearData();
        });

        it("should load", () => {

            return conf.load({
                "loadEnvFile": envFile,
                "loadConsole": false,
                "loadEnv": false
            });

        });

    });

    describe("from console first", () => {

        const conf = new NodeConfManager(CONF_FILE);
        const argv = clone((0, process).argv);

        before(() => {

            conf.clear();

            return conf
                .skeleton("debug", "boolean").shortcut("debug", "d")
                .skeleton("test", "string").shortcut("test", "t").limit("test", [ "test", "test2" ])
                .skeleton("plugins", "array");

        });

        beforeEach(() => {
            (0, process).argv = clone(argv);
            conf.clearData();
        });

        it("should not load (wrong limits)", (done) => {

            (0, process).argv.push("--debug", "this is a test");
            (0, process).argv.push("--test", "this is a test");

            conf.load({
                "loadConsole": true,
                "loadEnv": false
            }).then(() => {
                done(new Error("Does not generate an error"));
            }).catch((err) => {

                strictEqual(typeof err, "object", "Generated error is not an object");
                ok(err instanceof Error);

                done();

            });

        });

        it("should not load (no more arguments)", (done) => {

            (0, process).argv.push("--test");

            conf.load({
                "loadConsole": true,
                "loadEnv": false
            }).then(() => {
                done(new Error("Does not generate an error"));
            }).catch((err) => {

                strictEqual(typeof err, "object", "Generated error is not an object");
                ok(err instanceof Error);

                done();

            });

        });

        it("should not load (next argument is a valid key)", (done) => {

            (0, process).argv.push("--test");
            (0, process).argv.push("--test2");

            conf.load({
                "loadConsole": true,
                "loadEnv": false
            }).then(() => {
                done(new Error("Does not generate an error"));
            }).catch((err) => {

                strictEqual(typeof err, "object", "Generated error is not an object");
                ok(err instanceof Error);

                done();

            });

        });

        it("should not load (next argument is a valid shortcut)", (done) => {

            (0, process).argv.push("--test");
            (0, process).argv.push("-d");

            conf.load({
                "loadConsole": true,
                "loadEnv": false
            }).then(() => {
                done(new Error("Does not generate an error"));
            }).catch((err) => {

                strictEqual(typeof err, "object", "Generated error is not an object");
                ok(err instanceof Error);

                done();

            });

        });

        it("should load (with empty key)", () => {

            (0, process).argv.push("--");

            return conf.load({
                "loadEnv": false
            });

        });

        it("should load boolean", () => {

            (0, process).argv.push("--debug");

            return conf.load({
                "loadEnv": false
            }).then(() => {

                ok(conf.get("debug"));

            });

        });

        it("should load array (with no value)", (done) => {

            (0, process).argv.push("--plugins");

            conf.load({
                "loadConsole": true,
                "loadEnv": false
            }).then(() => {
                done(new Error("Does not generate an error"));
            }).catch((err) => {

                strictEqual(typeof err, "object", "Generated error is not an object");
                ok(err instanceof Error);

                done();

            });

        });

        it("should load array (with no value and a new key)", (done) => {

            (0, process).argv.push("--plugins");
            (0, process).argv.push("--debug");

            conf.load({
                "loadConsole": true,
                "loadEnv": false
            }).then(() => {
                done(new Error("Does not generate an error"));
            }).catch((err) => {

                strictEqual(typeof err, "object", "Generated error is not an object");
                ok(err instanceof Error);

                done();

            });

        });

        it("should load array (from parsed string)", () => {

            (0, process).argv.push("--plugins");
            (0, process).argv.push("[ \"test1\", \"test2\" ]");

            return conf.load({
                "loadConsole": true,
                "loadEnv": false
            }).then(() => {

                deepStrictEqual(conf.get("plugins"), [ "test1", "test2" ]);

            });

        });

        it("should load array (from multiple strings)", () => {

            (0, process).argv.push("--plugins");
            (0, process).argv.push("test1");
            (0, process).argv.push("test2");

            return conf.load({
                "loadConsole": true,
                "loadEnv": false
            }).then(() => {

                deepStrictEqual(conf.get("plugins"), [ "test1", "test2" ]);

            });

        });

        it("should load", () => {

            return Promise.resolve().then(() => {

                conf
                    .set("usr", {
                        "login": "login",
                        "pwd": "pwd"
                    })
                    .set("debug", "n")
                    .set("authors", [ "author1", "author2" ]);

            }).then(() => {

                strictEqual(conf.size, 3, "check loaded data failed (size)");

                strictEqual(conf.get("debug"), false, "check loaded data failed (debug)");
                deepStrictEqual(conf.get("usr"), {
                    "login": "login",
                    "pwd": "pwd"
                }, "check 'usr' loaded data failed");

            }).then(() => {

                (0, process).argv.push("--debug", "true");
                (0, process).argv.push("--test", "test2");

                return conf.load({
                    "loadConsole": true,
                    "loadEnv": false
                }).then(() => {
                    _removeMochaConsoleArguments(conf);
                });

            }).then(() => {

                strictEqual(conf.size, 2, "check loaded data failed (size)");

                ok(conf.get("debug"));
                strictEqual(conf.get("test"), "test2", "check loaded data failed (test)");

            });

        });

        it("should load with shortcuts", () => {

            return Promise.resolve().then(() => {

                conf
                    .set("usr", {
                        "login": "login",
                        "pwd": "pwd"
                    })
                    .set("debug", "n")
                    .set("authors", [ "author1", "author2" ]);

            }).then(() => {

                strictEqual(conf.size, 3, "check loaded data failed (size)");

                deepStrictEqual(conf.get("authors"), [ "author1", "author2" ], "check 'authors' loaded data failed");
                strictEqual(conf.get("debug"), false, "check loaded data failed (debug)");
                deepStrictEqual(conf.get("usr"), {
                    "login": "login",
                    "pwd": "pwd"
                }, "check 'usr' loaded data failed");

            }).then(() => {

                (0, process).argv.push("-d", "true");
                (0, process).argv.push("-t", "test2");

                return conf.load({
                    "loadConsole": true,
                    "loadEnv": false
                }).then(() => {
                    _removeMochaConsoleArguments(conf);
                });

            }).then(() => {

                strictEqual(conf.size, 2, "check loaded data failed (size)");

                ok(conf.get("debug"));
                strictEqual(conf.get("test"), "test2", "check loaded data failed (test)");

            });

        });

        it("should load with shortcuts and no data", () => {

            return Promise.resolve().then(() => {

                conf.set("debug", "n");

            }).then(() => {

                strictEqual(conf.size, 1, "check loaded data failed (size)");
                strictEqual(conf.get("debug"), false, "check loaded data failed (debug)");

            }).then(() => {

                (0, process).argv.push("-d");

                return conf.load({
                    "loadConsole": true,
                    "loadEnv": false
                }).then(() => {
                    _removeMochaConsoleArguments(conf);
                });

            }).then(() => {

                strictEqual(conf.size, 1, "check loaded data failed (size)");
                ok(conf.get("debug"));

            });

        });

        it("should load with recursive data", () => {

            return Promise.resolve().then(() => {

                conf
                    .set("usr", {
                        "login": "login",
                        "pwd": "pwd"
                    })
                    .set("debug", "n")
                    .set("authors", [ "author1", "author2" ]);

            }).then(() => {

                strictEqual(conf.size, 3, "check loaded data failed (size)");

                deepStrictEqual(conf.get("authors"), [ "author1", "author2" ], "check 'authors' loaded data failed");
                strictEqual(conf.get("debug"), false, "check loaded data failed (debug)");
                deepStrictEqual(conf.get("usr"), {
                    "login": "login",
                    "pwd": "pwd"
                }, "check 'usr' loaded data failed");

            }).then(() => {

                (0, process).argv.push("--usr.login", "login2");
                (0, process).argv.push("--lvl1.lvl2.lvl3", "test");

                return conf.load({
                    "loadConsole": true,
                    "loadEnv": false
                }).then(() => {
                    _removeMochaConsoleArguments(conf);
                });

            }).then(() => {

                strictEqual(conf.size, 2, "check loaded data failed (size)");

                deepStrictEqual(conf.get("lvl1"), {
                    "lvl2": {
                        "lvl3": "test"
                    }
                }, "check 'lvl1' loaded data failed");
                deepStrictEqual(conf.get("usr"), {
                    "login": "login2"
                }, "check 'usr' loaded data failed");

            });

        });

    });

    describe("from env file content (via load)", () => {

        const envTmp = join(__dirname, "utils", "2_6_tmp_env.env");
        let conf = null;

        beforeEach(() => {

            conf = new NodeConfManager(NO_CONF_FILE);

            conf.clear();

            conf.skeleton("mykey", "string")
                .skeleton("uppercasekey", "string")
                .skeleton("eqkey", "string")
                .skeleton("first", "string")
                .skeleton("second", "string")
                .skeleton("key_after_bad_line", "string");

        });

        afterEach(() => {

            return unlink(envTmp).catch(() => {
                return Promise.resolve();
            });

        });

        it("should load variables with lowercased keys and skip comment lines", () => {

            return writeFile(envTmp, [
                "# ignored comment",
                "MYKEY=myvalue",
                "UPPERCASEKEY=lowercase"
            ].join("\n"), "utf-8").then(() => {

                return conf.load({
                    "loadEnvFile": envTmp,
                    "loadConsole": false,
                    "loadEnv": false
                });

            }).then(() => {

                strictEqual(conf.get("mykey"), "myvalue");
                strictEqual(conf.get("uppercasekey"), "lowercase");

            });

        });

        it("should take only the first segment after '=' as value (split/destructuring)", () => {

            return writeFile(envTmp, "EQKEY=a=b=c\n", "utf-8").then(() => {

                return conf.load({
                    "loadEnvFile": envTmp,
                    "loadConsole": false,
                    "loadEnv": false
                });

            }).then(() => {

                strictEqual(conf.get("eqkey"), "a=b=c");

            });

        });

        it("should ignore empty lines (and lines that trim to empty)", () => {

            return writeFile(envTmp, [
                "FIRST=one",
                "",
                "   ",
                "",
                "SECOND=two"
            ].join("\n"), "utf-8").then(() => {

                return conf.load({
                    "loadEnvFile": envTmp,
                    "loadConsole": false,
                    "loadEnv": false
                });

            }).then(() => {

                strictEqual(conf.get("first"), "one");
                strictEqual(conf.get("second"), "two");
                strictEqual(conf.size, 2);

            });

        });

        it("should ignore lines without \"=\"", () => {

            return writeFile(envTmp, [
                "not a valid env line",
                "KEY_AFTER_BAD_LINE=value"
            ].join("\n"), "utf-8").then(() => {

                return conf.load({
                    "loadEnvFile": envTmp,
                    "loadConsole": false,
                    "loadEnv": false
                });

            }).then(() => {

                strictEqual(conf.get("key_after_bad_line"), "value");
                strictEqual(conf.size, 1);
                strictEqual(conf.has("not a valid env line"), false);

            });

        });

        it("should reject when env file path does not exist", () => {

            const missing = join(__dirname, "utils", "2_6_definitely_missing_env.env");

            return conf.load({
                "loadEnvFile": missing,
                "loadConsole": false,
                "loadEnv": false
            }).then(() => {
                throw new Error("Expected rejection");
            }).catch((err) => {

                strictEqual(typeof err, "object", "Generated error is not an object");
                ok(err instanceof Error);

            });

        });

    });

    describe("from process env (via load)", () => {

        const envKey = "NODECONFMANAGER_2_6_UNIT_ENV";
        const envVal = "from_process_env";
        let conf = null;
        let hadEnvKey = false;
        let envPrevious = "";

        beforeEach(() => {

            const { env } = (0, process);

            hadEnvKey = Object.hasOwn(env, envKey);
            envPrevious = hadEnvKey ? env[envKey] : "";
            env[envKey] = envVal;
            conf = new NodeConfManager(NO_CONF_FILE);

            conf.clear();
            conf.skeleton(envKey.toLowerCase(), "string");

        });

        afterEach(() => {

            const { env } = (0, process);

            if (hadEnvKey) {
                env[envKey] = envPrevious;
            }
            else {
                delete env[envKey];
            }

        });

        it("should expose process.env value under lowercased key", () => {

            return conf.load({
                "loadEnvFile": "",
                "loadConsole": false,
                "loadEnv": true
            }).then(() => {

                strictEqual(conf.get(envKey.toLowerCase()), envVal);

            });

        });

        it("should not load from process.env when loadEnv is false", () => {

            return conf.load({
                "loadEnvFile": "",
                "loadConsole": false,
                "loadEnv": false
            }).then(() => {

                strictEqual(conf.has(envKey.toLowerCase()), false);

            });

        });

        it("should load from process.env when loadEnv is omitted (defaults to true)", () => {

            return conf.load({
                "loadConsole": false
            }).then(() => {

                strictEqual(conf.get(envKey.toLowerCase()), envVal);

            });

        });

    });

    describe("load source priority (env > console > envfile > conf file)", () => {

        const prioEnv = join(__dirname, "utils", "2_6_priority.env");
        const conf = new NodeConfManager(PRIO_CONF_FILE);
        const argv = clone((0, process).argv);

        before(() => {

            conf.clear();
            conf.skeleton("marker", "string");

        });

        beforeEach(() => {

            (0, process).argv = clone(argv);
            conf.clearData();

        });

        afterEach(() => {

            delete (0, process).env.MARKER;

            return Promise.all([
                unlink(PRIO_CONF_FILE).catch(() => {
                    return Promise.resolve();
                }),
                unlink(prioEnv).catch(() => {
                    return Promise.resolve();
                })
            ]);

        });

        after(() => {

            conf.clear();

            return Promise.all([
                unlink(PRIO_CONF_FILE).catch(() => {
                    return Promise.resolve();
                }),
                unlink(prioEnv).catch(() => {
                    return Promise.resolve();
                })
            ]);

        });

        it("envfile should overwrite conf file", () => {

            return conf
                .set("marker", "from_conf_file")
                .save()
                .then(() => {
                    return writeFile(prioEnv, "MARKER=from_env_file\n", "utf-8");
                })
                .then(() => {

                    return conf.load({
                        "loadEnvFile": prioEnv,
                        "loadConsole": false,
                        "loadEnv": false
                    });

                })
                .then(() => {

                    strictEqual(conf.get("marker"), "from_env_file");

                });

        });

        it("console should overwrite envfile and conf file", () => {

            (0, process).argv.push("--marker", "from_console");

            return conf
                .set("marker", "from_conf_file")
                .save()
                .then(() => {
                    return writeFile(prioEnv, "MARKER=from_env_file\n", "utf-8");
                })
                .then(() => {

                    return conf.load({
                        "loadEnvFile": prioEnv,
                        "loadConsole": true,
                        "loadEnv": false
                    });

                })
                .then(() => {

                    _removeMochaConsoleArguments(conf);
                    strictEqual(conf.get("marker"), "from_console");

                });

        });

        it("process.env should overwrite console, envfile and conf file", () => {

            (0, process).env.MARKER = "from_env";
            (0, process).argv.push("--marker", "from_console");

            return conf
                .set("marker", "from_conf_file")
                .save()
                .then(() => {
                    return writeFile(prioEnv, "MARKER=from_env_file\n", "utf-8");
                }).then(() => {

                    return conf.load({
                        "loadEnvFile": prioEnv,
                        "loadConsole": true,
                        "loadEnv": true
                    });

                }).then(() => {

                    _removeMochaConsoleArguments(conf);
                    strictEqual(conf.get("marker"), "from_env");

                });

        });

    });

});
