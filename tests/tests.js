"use strict";

// deps

	const 	path = require("path"),
			assert = require("assert"),

			fs = require("fs"),
			
			SimpleConfig = require(path.join(__dirname, "..", "lib", "main.js"));

// private

	// attrs

		var _confDir = path.join(__dirname, "conf"),
			_confFile = path.join(_confDir, "conf.json"),
			Conf = new SimpleConfig(_confFile);

		Conf.spaces = true;

	// methods

		function _deleteDirConfIfExists(callback) {

			try {

				if (!fs.lstatSync(_confDir).isDirectory()) {
					callback(null);
				}
				else {

					Conf.deleteFile().then(function() {

						fs.rmdir(_confDir, function(err) {

							if (err) {
								callback((err.message) ? err.message : err);
							}
							else {
								callback(null);
							}
							
						});

					}).catch(callback);

				}

			}
			catch (e) {
				callback(null);
			}

		}

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
	after(function(done) { _deleteDirConfIfExists(done); });

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
	after(function(done) { _deleteDirConfIfExists(done); });

	it("should save a configuration", function(done) {

		Conf.fileExists().then(function(exists) {

			assert.strictEqual(false, exists, "check file existance failed");

			if (exists) {
				done();
			}
			else {

				Conf.set("usr", { login : "login", pwd : "pwd" })
					.set("debug", "n")
					.set("authors", [ "author1", "author2" ])
					.save().then(done).catch(done);

			}

		});

	});

});

describe("load", function() {

	before(function() {
		return Conf.clear().bindSkeleton("debug", "boolean").deleteFile();
	});
	beforeEach(function() { Conf.clearData(); });
	after(function(done) { _deleteDirConfIfExists(done); });

	it("should load a configuration from file with pending promises", function(done) {

		Conf.fileExists().then(function(exists) {

			assert.strictEqual(false, exists, "check file existance failed");

			Conf.set("usr", { login : "login", pwd : "pwd" })
				.set("debug", "n")
				.set("authors", [ "author1", "author2" ])
				.save().catch(done);

			Conf.load().then(function() {
				assert.strictEqual(false, Conf.get("debug"), "check 'debug' loaded data failed");
				assert.strictEqual(3, Conf.size, "check 'size' loaded data failed");
				done();
			}).catch(done);

		});

	});

	it("should load a configuration from file with successive promises", function(done) {

		Conf.fileExists().then(function(exists) {

			assert.strictEqual(true, exists, "check file existance failed");

			Conf.set("usr", { login : "login", pwd : "pwd" })
				.set("debug", "n")
				.set("authors", [ "author1", "author2" ])
			.save().then(function() {
				return Conf.load();
			}).then(function() {
				assert.strictEqual(false, Conf.get("debug"), "check 'debug' loaded data failed");
				assert.strictEqual(3, Conf.size, "check 'size' loaded data failed");
				done();
			}).catch(done);

		});

	});

	it("should load a configuration from console first", function(done) {

		process.argv.push("--debug", "true");
		process.argv.push("--test", "test2");

		Conf.set("usr", { login : "login", pwd : "pwd" })
			.set("debug", "n")
			.set("authors", [ "author1", "author2" ]).load()
		.then(function() {
			assert.strictEqual(true, Conf.get("debug"), "check loaded data failed (debug)");
			assert.strictEqual("test2", Conf.get("test"), "check loaded data failed (test)");
			assert.strictEqual(4, Conf.size, "check loaded data failed (size)");
			done();
		}).catch(done);

	});

	it("should load a configuration from console first with shortcuts", function(done) {

		Conf.bindShortcut("debug", "d").bindShortcut("test", "t");

		process.argv.push("-d", "true");
		process.argv.push("-t", "test2");

		Conf.set("usr", { login : "login", pwd : "pwd" })
			.set("debug", "n")
			.set("authors", [ "author1", "author2" ]).load()
		.then(function() {
			assert.strictEqual(true, Conf.get("debug"), "check loaded data failed (debug)");
			assert.strictEqual("test2", Conf.get("test"), "check loaded data failed (test)");
			assert.strictEqual(4, Conf.size, "check loaded data failed (size)");
			done();
		}).catch(done);

	});

	it("should load a configuration from console first with recursive data", function(done) {

		process.argv.push("--usr.login", "login2", "--lvl1.lvl2.lvl3", "test");

		Conf.set("usr", { login : "login", pwd : "pwd" })
			.set("debug", "n")
			.set("authors", [ "author1", "author2" ]).load()
		.then(function() {
			assert.strictEqual(true, Conf.get("debug"), "check loaded data failed (debug)");
			assert.strictEqual("login2", Conf.get("usr").login, "check loaded data failed (usr.login)");
			assert.strictEqual("test", Conf.get("lvl1.lvl2.lvl3"), "check loaded data failed (usr.login)");
			assert.strictEqual(5, Conf.size, "check loaded data failed (size)");
			done();
		}).catch(done);

	});

});

describe("set", function() {

	before(function() { return Conf.clear().deleteFile(); });
	after(function(done) { _deleteDirConfIfExists(done); });

	it("should set a value", function() {
		assert.throws(function() { Conf.set(15); }, Error, "check type value does not throw an error");
	});

});

describe("get", function() {

	before(function() { return Conf.clear().deleteFile(); });
	after(function(done) { _deleteDirConfIfExists(done); });

	it("should get a value", function() {

		Conf.set("usr", { login : "login", pwd : "pwd" });

		let usr = Conf.get("usr");

		assert.strictEqual("login", usr.login, "check file existance failed");

		usr.login = "login2";

		assert.strictEqual("login2", usr.login, "check file existance failed");
		assert.strictEqual("login", Conf.get("usr").login, "check file existance failed");

	});

});
