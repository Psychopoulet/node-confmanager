"use strict";

// deps

	const 	path = require("path"),
			assert = require("assert"),

			NodeConfManager = require(path.join(__dirname, "..", "lib", "main.js"));

// private

	// attrs

		var Conf = new NodeConfManager(path.join(__dirname, "conf.json"), true);

// tests

describe("constructor", () => {

	it("should check type value", () => {
		assert.throws(() => { new NodeConfManager(false); }, Error, "check 'filePath' type value does not throw an error");
		assert.throws(() => { new NodeConfManager("test", "test"); }, Error, "check 'spaces' type value does not throw an error");
		assert.throws(() => { new NodeConfManager("test", false, false); }, Error, "check 'commandlineSeparator' type value does not throw an error");
	});

});

describe("bindShortcut", () => {

	before(() => { return Conf.clear().deleteFile(); });
	beforeEach(() => { return Conf.clear(); });
	after(() => { return Conf.clear().deleteFile(); });

	it("should test wrong binds", () => {

		assert.throws(() => { Conf.bindShortcut(false, "t"); }, Error, "check type value does not throw an error");
		assert.throws(() => { Conf.bindShortcut("", "t"); }, Error, "check type value does not throw an error");

	});

	it("should bind shortcut", () => {
		assert.strictEqual(true, Conf.set("test", "test").bindShortcut("test", "t") instanceof NodeConfManager, "return data is not an instanceof NodeConfManager");
		assert.strictEqual(true, Conf.set("test", "test").bindShortcut("TEST", "T") instanceof NodeConfManager, "return data is not an instanceof NodeConfManager");
	});

});

describe("save", () => {

	before(() => { return Conf.clear().deleteFile(); });
	after(() => { return Conf.clear().deleteFile(); });

	it("should save a configuration", () => {

		return Conf.fileExists().then((exists) => {

			assert.strictEqual(false, exists, "check file existance failed");

			if (exists) {
				return Promise.resolve();
			}
			else {

				return Conf .set("usr", { login : "login", pwd : "pwd" })
							.set("debug", "n")
							.set("authors", [ "author1", "author2" ])
							.save();

			}

		});

	});

});

describe("load", () => {

	before(() => { return Conf.clear().bindSkeleton("debug", "boolean").deleteFile(); });
	beforeEach(() => { Conf.clearData().clearLimits(); });
	after(() => { return Conf.clear().deleteFile(); });

	it("should load a configuration with successive promises", () => {

		return Conf.fileExists().then((exists) => {

			assert.strictEqual(false, exists, "check file existance failed");

			return Conf .set("usr", { login : "login", pwd : "pwd" })
						.set("debug", "n")
						.set("authors", [ "author1", "author2" ])
						.save();

		}).then(() => {
			return Conf.load();
		}).then(() => {

			assert.strictEqual(false, Conf.get("debug"), "check 'debug' loaded data failed");
			assert.strictEqual(3, Conf.size, "check 'size' loaded data failed");

			return Conf.fileExists();

		}).then((exists) => {
			assert.strictEqual(true, exists, "check file existance failed");
		});

	});

	it("should load a configuration with limit", () => {

		Conf.limit("debug", [ true, false ]);

		return Conf.load().then(() => {
			assert.strictEqual(false, true, "'debug' limit data failed");
		}).catch(() => {
			return Promise.resolve();
		});

	});

	describe("from console first", () => {

		beforeEach(() => { Conf.clearData(); });

		it("should load", () => {

			process.argv.push("--debug", "true");
			process.argv.push("--test", "test2");

			return Conf .set("usr", { login : "login", pwd : "pwd" })
						.set("debug", "n")
						.set("authors", [ "author1", "author2" ]).load()
			.then(() => {
				assert.strictEqual(true, Conf.get("debug"), "check loaded data failed (debug)");
				assert.strictEqual("test2", Conf.get("test"), "check loaded data failed (test)");
				assert.strictEqual(4, Conf.size, "check loaded data failed (size)");
			});

		});

		it("should load with shortcuts", () => {

			Conf.bindShortcut("debug", "d").bindShortcut("test", "t");

			process.argv.push("-d", "true");
			process.argv.push("-t", "test2");

			return Conf .set("usr", { login : "login", pwd : "pwd" })
						.set("debug", "n")
						.set("authors", [ "author1", "author2" ]).load()
			.then(() => {
				assert.strictEqual(true, Conf.get("debug"), "check loaded data failed (debug)");
				assert.strictEqual("test2", Conf.get("test"), "check loaded data failed (test)");
				assert.strictEqual(4, Conf.size, "check loaded data failed (size)");
			});

		});

		it("should load with recursive data", () => {

			process.argv.push("--usr.login", "login2", "--lvl1.lvl2.lvl3", "test");

			return Conf .set("usr", { login : "login", pwd : "pwd" })
						.set("debug", "n")
						.set("authors", [ "author1", "author2" ]).load()
			.then(() => {
				assert.strictEqual(true, Conf.get("debug"), "check loaded data failed (debug)");
				assert.strictEqual("login2", Conf.get("usr").login, "check loaded data failed (usr.login)");
				assert.strictEqual("test", Conf.get("lvl1.lvl2.lvl3"), "check loaded data failed (usr.login)");
				assert.strictEqual(5, Conf.size, "check loaded data failed (size)");
			});

		});

	});

});

describe("set", () => {

	before(() => { return Conf.clear().deleteFile(); });
	after(() => { return Conf.clear().deleteFile(); });

	it("should set a value", () => {
		assert.throws(() => { Conf.set(15); }, Error, "check type value does not throw an error");
	});

});

describe("get", () => {

	before(() => { return Conf.clear().deleteFile(); });
	after(() => { return Conf.clear().deleteFile(); });

	it("should get a value", () => {

		Conf.set("usr", { login : "login", pwd : "pwd" });

		let usr = Conf.get("usr");

		assert.strictEqual("login", usr.login, "check file existance failed");

		usr.login = "login2";

		assert.strictEqual("login2", usr.login, "check file existance failed");
		assert.strictEqual("login", Conf.get("usr").login, "check file existance failed");

	});

});
