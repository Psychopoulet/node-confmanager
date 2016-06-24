"use strict";

// deps

	const 	path = require("path"),
			assert = require("assert"),

			SimpleConfig = require(path.join(__dirname, "..", "lib", "main.js"));

// private

	// attrs

		var Conf = new SimpleConfig(path.join(__dirname, "conf.json"), true);

// tests

describe("constructor", function() {

	it("should check type value", function() {
		assert.throws(function() { new SimpleConfig(false); }, Error, "check 'filePath' type value does not throw an error");
		assert.throws(function() { new SimpleConfig("test", "test"); }, Error, "check 'spaces' type value does not throw an error");
		assert.throws(function() { new SimpleConfig("test", false, false); }, Error, "check 'commandlineSeparator' type value does not throw an error");
	});

});

describe("bindShortcut", function() {

	before(function() { return Conf.clear().deleteFile(); });
	beforeEach(function() { return Conf.clear(); });
	after(function() { return Conf.clear().deleteFile(); });

	it("should test wrong binds", function() {

		assert.throws(function() { Conf.bindShortcut(false, "t"); }, Error, "check type value does not throw an error");
		assert.throws(function() { Conf.bindShortcut("", "t"); }, Error, "check type value does not throw an error");

	});

	it("should bind shortcut", function() {
		assert.strictEqual(true, Conf.set("test", "test").bindShortcut("test", "t") instanceof SimpleConfig, "return data is not an instanceof SimpleConfig");
		assert.strictEqual(true, Conf.set("test", "test").bindShortcut("TEST", "T") instanceof SimpleConfig, "return data is not an instanceof SimpleConfig");
	});

});

describe("save", function() {

	before(function() { return Conf.clear().deleteFile(); });
	after(function() { return Conf.clear().deleteFile(); });

	it("should save a configuration", function() {

		return Conf.fileExists().then(function(exists) {

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

describe("load", function() {

	before(function() { return Conf.clear().bindSkeleton("debug", "boolean").deleteFile(); });
	beforeEach(function() { Conf.clearData(); });
	after(function() { return Conf.clear().deleteFile(); });

	it("should load a configuration with successive promises", function() {

		return Conf.fileExists().then(function(exists) {

			assert.strictEqual(false, exists, "check file existance failed");

			return Conf .set("usr", { login : "login", pwd : "pwd" })
						.set("debug", "n")
						.set("authors", [ "author1", "author2" ])
						.save();

		}).then(function() {
			return Conf.load();
		}).then(function() {

			assert.strictEqual(false, Conf.get("debug"), "check 'debug' loaded data failed");
			assert.strictEqual(3, Conf.size, "check 'size' loaded data failed");

			return Conf.fileExists();

		}).then(function(exists) {
			assert.strictEqual(true, exists, "check file existance failed");
		});

	});

	describe("from console first", function() {

		beforeEach(function() { Conf.clearData(); });

		it("should load", function() {

			process.argv.push("--debug", "true");
			process.argv.push("--test", "test2");

			return Conf .set("usr", { login : "login", pwd : "pwd" })
						.set("debug", "n")
						.set("authors", [ "author1", "author2" ]).load()
			.then(function() {
				assert.strictEqual(true, Conf.get("debug"), "check loaded data failed (debug)");
				assert.strictEqual("test2", Conf.get("test"), "check loaded data failed (test)");
				assert.strictEqual(4, Conf.size, "check loaded data failed (size)");
			});

		});

		it("should load with shortcuts", function() {

			Conf.bindShortcut("debug", "d").bindShortcut("test", "t");

			process.argv.push("-d", "true");
			process.argv.push("-t", "test2");

			return Conf .set("usr", { login : "login", pwd : "pwd" })
						.set("debug", "n")
						.set("authors", [ "author1", "author2" ]).load()
			.then(function() {
				assert.strictEqual(true, Conf.get("debug"), "check loaded data failed (debug)");
				assert.strictEqual("test2", Conf.get("test"), "check loaded data failed (test)");
				assert.strictEqual(4, Conf.size, "check loaded data failed (size)");
			});

		});

		it("should load with recursive data", function() {

			process.argv.push("--usr.login", "login2", "--lvl1.lvl2.lvl3", "test");

			return Conf .set("usr", { login : "login", pwd : "pwd" })
						.set("debug", "n")
						.set("authors", [ "author1", "author2" ]).load()
			.then(function() {
				assert.strictEqual(true, Conf.get("debug"), "check loaded data failed (debug)");
				assert.strictEqual("login2", Conf.get("usr").login, "check loaded data failed (usr.login)");
				assert.strictEqual("test", Conf.get("lvl1.lvl2.lvl3"), "check loaded data failed (usr.login)");
				assert.strictEqual(5, Conf.size, "check loaded data failed (size)");
			});

		});

	});

});

describe("set", function() {

	before(function() { return Conf.clear().deleteFile(); });
	after(function() { return Conf.clear().deleteFile(); });

	it("should set a value", function() {
		assert.throws(function() { Conf.set(15); }, Error, "check type value does not throw an error");
	});

});

describe("get", function() {

	before(function() { return Conf.clear().deleteFile(); });
	after(function() { return Conf.clear().deleteFile(); });

	it("should get a value", function() {

		Conf.set("usr", { login : "login", pwd : "pwd" });

		let usr = Conf.get("usr");

		assert.strictEqual("login", usr.login, "check file existance failed");

		usr.login = "login2";

		assert.strictEqual("login2", usr.login, "check file existance failed");
		assert.strictEqual("login", Conf.get("usr").login, "check file existance failed");

	});

});
