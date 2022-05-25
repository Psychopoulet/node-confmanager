"use strict";

// deps

	// natives
	const { join } = require("path");
	const assert = require("assert");

	// locals
	const NodeConfManager = require(join(__dirname, "..", "lib", "main.js"));
	const clone = require(join(__dirname, "..", "lib", "clone.js"));

// consts

	const CONF_FILE = join(__dirname, "conf.json");

// private

	// methods

		/**
		* Remove mocha's console arguments
		* @param {NodeConfManager} conf : conf to clean
		* @returns {Promise} Operation's result
		*/
		function _removeMochaConsoleArguments (conf) {

			[ "extension", "reporter", "slow", "timeout", "ui" ].forEach((key) => {
				conf.delete(key);
			});

			return Promise.resolve();

		}

// tests

describe("load", () => {

	it("should load a configuration without file", () => {
		return new NodeConfManager().load();
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

				assert.strictEqual(exists, false, "check file existance failed");

				return conf
					.set("usr", {
						"login": "login",
						"pwd": "pwd"
					})
					.set("debug", "n")
					.set("authors", [ "author1", "author2" ])
					.save();

			}).then(() => {

				return conf.load().then(() => {
					return _removeMochaConsoleArguments(conf);
				});

			}).then(() => {

				assert.strictEqual(conf.size, 3, "check 'size' loaded data failed");

				assert.deepStrictEqual(conf.get("authors"), [ "author1", "author2" ], "check 'authors' loaded data failed");
				assert.strictEqual(conf.get("debug"), false, "check 'debug' loaded data failed");
				assert.deepStrictEqual(conf.get("usr"), {
					"login": "login",
					"pwd": "pwd"
				}, "check 'usr' loaded data failed");

				return conf.fileExists();

			}).then((exists) => {
				assert.strictEqual(exists, true, "check file existance failed");
			});

		});

		it("should load a configuration with limit", () => {

			conf.limit("debug", [ true, false ]);

			return conf.load().catch(() => {
				return Promise.resolve();
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
				.skeleton("test", "string").shortcut("test", "t").limit("test", [ "test", "test2" ]);

		});

		beforeEach(() => {
			(0, process).argv = clone(argv);
			conf.clearData();
		});

		it("should not load (wrong limits)", (done) => {

			(0, process).argv.push("--debug", "this is a test");
			(0, process).argv.push("--test", "this is a test");

			conf.load().then(() => {
				done(new Error("Does not generate an error"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "Generated error is not an object");
				assert.strictEqual(err instanceof Error, true, "Generated error is not an instance of Error");

				done();

			});

		});

		it("should not load (no more arguments)", (done) => {

			(0, process).argv.push("--test");

			conf.load().then(() => {
				done(new Error("Does not generate an error"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "Generated error is not an object");
				assert.strictEqual(err instanceof Error, true, "Generated error is not an instance of Error");

				done();

			});

		});

		it("should not load (next argument is a valid key)", (done) => {

			(0, process).argv.push("--test");
			(0, process).argv.push("--test2");

			conf.load().then(() => {
				done(new Error("Does not generate an error"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "Generated error is not an object");
				assert.strictEqual(err instanceof Error, true, "Generated error is not an instance of Error");

				done();

			});

		});

		it("should not load (next argument is a valid shortcut)", (done) => {

			(0, process).argv.push("--test");
			(0, process).argv.push("-d");

			conf.load().then(() => {
				done(new Error("Does not generate an error"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "Generated error is not an object");
				assert.strictEqual(err instanceof Error, true, "Generated error is not an instance of Error");

				done();

			});

		});

		it("should load (with empty key)", () => {

			(0, process).argv.push("--");

			return conf.load();

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

				return Promise.resolve();

			}).then(() => {

				assert.strictEqual(conf.size, 3, "check loaded data failed (size)");

				assert.strictEqual(conf.get("debug"), false, "check loaded data failed (debug)");
				assert.deepStrictEqual(conf.get("usr"), {
					"login": "login",
					"pwd": "pwd"
				}, "check 'usr' loaded data failed");

				return Promise.resolve();

			}).then(() => {

				(0, process).argv.push("--debug", "true");
				(0, process).argv.push("--test", "test2");

				return conf.load().then(() => {
					return _removeMochaConsoleArguments(conf);
				});

			}).then(() => {

				assert.strictEqual(conf.size, 2, "check loaded data failed (size)");

				assert.strictEqual(conf.get("debug"), true, "check loaded data failed (debug)");
				assert.strictEqual(conf.get("test"), "test2", "check loaded data failed (test)");

				return Promise.resolve();

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

				return Promise.resolve();

			}).then(() => {

				assert.strictEqual(conf.size, 3, "check loaded data failed (size)");

				assert.deepStrictEqual(conf.get("authors"), [ "author1", "author2" ], "check 'authors' loaded data failed");
				assert.strictEqual(conf.get("debug"), false, "check loaded data failed (debug)");
				assert.deepStrictEqual(conf.get("usr"), {
					"login": "login",
					"pwd": "pwd"
				}, "check 'usr' loaded data failed");

				return Promise.resolve();

			}).then(() => {

				(0, process).argv.push("-d", "true");
				(0, process).argv.push("-t", "test2");

				return conf.load().then(() => {
					return _removeMochaConsoleArguments(conf);
				});

			}).then(() => {

				assert.strictEqual(conf.size, 2, "check loaded data failed (size)");

				assert.strictEqual(conf.get("debug"), true, "check loaded data failed (debug)");
				assert.strictEqual(conf.get("test"), "test2", "check loaded data failed (test)");

				return Promise.resolve();

			});

		});

		it("should load with shortcuts and no data", () => {

			return Promise.resolve().then(() => {

				conf.set("debug", "n");

				return Promise.resolve();

			}).then(() => {

				assert.strictEqual(conf.size, 1, "check loaded data failed (size)");
				assert.strictEqual(conf.get("debug"), false, "check loaded data failed (debug)");

				return Promise.resolve();

			}).then(() => {

				(0, process).argv.push("-d");

				return conf.load().then(() => {
					return _removeMochaConsoleArguments(conf);
				});

			}).then(() => {

				assert.strictEqual(conf.size, 1, "check loaded data failed (size)");
				assert.strictEqual(conf.get("debug"), true, "check loaded data failed (debug)");

				return Promise.resolve();

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

				return Promise.resolve();

			}).then(() => {

				assert.strictEqual(conf.size, 3, "check loaded data failed (size)");

				assert.deepStrictEqual(conf.get("authors"), [ "author1", "author2" ], "check 'authors' loaded data failed");
				assert.strictEqual(conf.get("debug"), false, "check loaded data failed (debug)");
				assert.deepStrictEqual(conf.get("usr"), {
					"login": "login",
					"pwd": "pwd"
				}, "check 'usr' loaded data failed");

				return Promise.resolve();

			}).then(() => {

				(0, process).argv.push("--usr.login", "login2");
				(0, process).argv.push("--lvl1.lvl2.lvl3", "test");

				return conf.load().then(() => {
					return _removeMochaConsoleArguments(conf);
				});

			}).then(() => {

				assert.strictEqual(conf.size, 2, "check loaded data failed (size)");

				assert.deepStrictEqual(conf.get("lvl1"), {
					"lvl2": {
						"lvl3": "test"
					}
				}, "check 'lvl1' loaded data failed");
				assert.deepStrictEqual(conf.get("usr"), {
					"login": "login2"
				}, "check 'usr' loaded data failed");

				return Promise.resolve();

			});

		});

	});

});
