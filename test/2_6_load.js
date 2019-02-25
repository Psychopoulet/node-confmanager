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
		* @param {NodeConfManager} Conf : Conf to clean
		* @returns {Promise} Operation's result
		*/
		function _removeMochaConsoleArguments (Conf) {

			[ "extension", "reporter", "slow", "timeout", "ui" ].forEach((key) => {
				Conf.delete(key);
			});

			return Promise.resolve();

		}

// tests

describe("load", () => {

	it("should load a configuration without file", () => {
		return new NodeConfManager().load();
	});

	describe("from file", () => {

		const Conf = new NodeConfManager(CONF_FILE, true);

		before(() => {
			return Conf.clear().skeleton("debug", "boolean").deleteFile();
		});

		beforeEach(() => {
			Conf.clearData().clearLimits();
		});

		after(() => {
			return Conf.clear().deleteFile();
		});

		it("should load a configuration with successive promises", () => {

			return Conf.fileExists().then((exists) => {

				assert.strictEqual(exists, false, "check file existance failed");

				return Conf
					.set("usr", {
						"login": "login",
						"pwd": "pwd"
					})
					.set("debug", "n")
					.set("authors", [ "author1", "author2" ])
					.save();

			}).then(() => {

				return Conf.load().then(() => {
					return _removeMochaConsoleArguments(Conf);
				});

			}).then(() => {

				assert.strictEqual(Conf.size, 3, "check 'size' loaded data failed");

				assert.deepStrictEqual(Conf.get("authors"), [ "author1", "author2" ], "check 'authors' loaded data failed");
				assert.strictEqual(Conf.get("debug"), false, "check 'debug' loaded data failed");
				assert.deepStrictEqual(Conf.get("usr"), {
					"login": "login",
					"pwd": "pwd"
				}, "check 'usr' loaded data failed");

				return Conf.fileExists();

			}).then((exists) => {
				assert.strictEqual(exists, true, "check file existance failed");
			});

		});

		it("should load a configuration with limit", () => {

			Conf.limit("debug", [ true, false ]);

			return Conf.load().catch(() => {
				return Promise.resolve();
			});

		});

	});

	describe("from console first", () => {

		const Conf = new NodeConfManager(CONF_FILE);
		const argv = clone((0, process).argv);

		before(() => {

			return Conf.clear()
				.skeleton("debug", "boolean").shortcut("debug", "d")
				.skeleton("test", "string").shortcut("test", "t").limit("test", [ "test", "test2" ]);

		});

		beforeEach(() => {
			(0, process).argv = clone(argv);
			Conf.clearData();
		});

		it("should not load", (done) => {

			(0, process).argv.push("--debug", "this is a test");
			(0, process).argv.push("--test", "this is a test");

			Conf.load().then(() => {
				done(new Error("Does not generate an error"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "Generated error is not an object");
				assert.strictEqual(err instanceof Error, true, "Generated error is not an instance of Error");

				done();

			});

		});

		it("should load", () => {

			return Promise.resolve().then(() => {

				Conf
					.set("usr", {
						"login": "login",
						"pwd": "pwd"
					})
					.set("debug", "n")
					.set("authors", [ "author1", "author2" ]);

				return Promise.resolve();

			}).then(() => {

				assert.strictEqual(Conf.size, 3, "check loaded data failed (size)");

				assert.strictEqual(Conf.get("debug"), false, "check loaded data failed (debug)");
				assert.deepStrictEqual(Conf.get("usr"), {
					"login": "login",
					"pwd": "pwd"
				}, "check 'usr' loaded data failed");

				return Promise.resolve();

			}).then(() => {

				(0, process).argv.push("--debug", "true");
				(0, process).argv.push("--test", "test2");

				return Conf.load().then(() => {
					return _removeMochaConsoleArguments(Conf);
				});

			}).then(() => {

				assert.strictEqual(Conf.size, 2, "check loaded data failed (size)");

				assert.strictEqual(Conf.get("debug"), true, "check loaded data failed (debug)");
				assert.strictEqual(Conf.get("test"), "test2", "check loaded data failed (test)");

				return Promise.resolve();

			});

		});

		it("should load with shortcuts", () => {

			return Promise.resolve().then(() => {

				Conf
					.set("usr", {
						"login": "login",
						"pwd": "pwd"
					})
					.set("debug", "n")
					.set("authors", [ "author1", "author2" ]);

				return Promise.resolve();

			}).then(() => {

				assert.strictEqual(Conf.size, 3, "check loaded data failed (size)");

				assert.deepStrictEqual(Conf.get("authors"), [ "author1", "author2" ], "check 'authors' loaded data failed");
				assert.strictEqual(Conf.get("debug"), false, "check loaded data failed (debug)");
				assert.deepStrictEqual(Conf.get("usr"), {
					"login": "login",
					"pwd": "pwd"
				}, "check 'usr' loaded data failed");

				return Promise.resolve();

			}).then(() => {

				(0, process).argv.push("-d", "true");
				(0, process).argv.push("-t", "test2");

				return Conf.load().then(() => {
					return _removeMochaConsoleArguments(Conf);
				});

			}).then(() => {

				assert.strictEqual(Conf.size, 2, "check loaded data failed (size)");

				assert.strictEqual(Conf.get("debug"), true, "check loaded data failed (debug)");
				assert.strictEqual(Conf.get("test"), "test2", "check loaded data failed (test)");

				return Promise.resolve();

			});

		});

		it("should load with shortcuts and no data", () => {

			return Promise.resolve().then(() => {

				Conf.set("debug", "n");

				return Promise.resolve();

			}).then(() => {

				assert.strictEqual(Conf.size, 1, "check loaded data failed (size)");
				assert.strictEqual(Conf.get("debug"), false, "check loaded data failed (debug)");

				return Promise.resolve();

			}).then(() => {

				(0, process).argv.push("-d");

				return Conf.load().then(() => {
					return _removeMochaConsoleArguments(Conf);
				});

			}).then(() => {

				assert.strictEqual(Conf.size, 1, "check loaded data failed (size)");
				assert.strictEqual(Conf.get("debug"), true, "check loaded data failed (debug)");

				return Promise.resolve();

			});

		});

		it("should load with recursive data", () => {

			return Promise.resolve().then(() => {

				Conf
					.set("usr", {
						"login": "login",
						"pwd": "pwd"
					})
					.set("debug", "n")
					.set("authors", [ "author1", "author2" ]);

				return Promise.resolve();

			}).then(() => {

				assert.strictEqual(Conf.size, 3, "check loaded data failed (size)");

				assert.deepStrictEqual(Conf.get("authors"), [ "author1", "author2" ], "check 'authors' loaded data failed");
				assert.strictEqual(Conf.get("debug"), false, "check loaded data failed (debug)");
				assert.deepStrictEqual(Conf.get("usr"), {
					"login": "login",
					"pwd": "pwd"
				}, "check 'usr' loaded data failed");

				return Promise.resolve();

			}).then(() => {

				(0, process).argv.push("--usr.login", "login2");
				(0, process).argv.push("--lvl1.lvl2.lvl3", "test");

				return Conf.load().then(() => {
					return _removeMochaConsoleArguments(Conf);
				});

			}).then(() => {

				assert.strictEqual(Conf.size, 2, "check loaded data failed (size)");

				assert.deepStrictEqual(Conf.get("lvl1"), {
					"lvl2": {
						"lvl3": "test"
					}
				}, "check 'lvl1' loaded data failed");
				assert.deepStrictEqual(Conf.get("usr"), {
					"login": "login2"
				}, "check 'usr' loaded data failed");

				return Promise.resolve();

			});

		});

	});

});
