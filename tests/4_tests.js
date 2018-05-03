"use strict";

// deps

	const { join } = require("path");
	const assert = require("assert");

	const NodeConfManager = require(join(__dirname, "..", "lib", "main.js"));
	const clone = require(join(__dirname, "..", "lib", "clone.js"));

// consts

	const CONF_FILE = join(__dirname, "conf.json");

// tests

describe("constructor", () => {

	it("should check filePath", () => {

		assert.throws(() => {
			new NodeConfManager(false).clear();
		}, TypeError, "check 'filePath' type value does not throw an error");

		assert.throws(() => {
			new NodeConfManager("").clear();
		}, Error, "check 'filePath' type value does not throw an error");

	});

	it("should check spaces", () => {

		assert.throws(() => {
			new NodeConfManager("test", "test").clear();
		}, TypeError, "check 'spaces' type value does not throw an error");

	});

	it("should check recursionSeparator", () => {

		assert.throws(() => {
			new NodeConfManager("test", false, false).clear();
		}, TypeError, "check 'recursionSeparator' type value does not throw an error");

		assert.throws(() => {
			new NodeConfManager("test", false, "").clear();
		}, Error, "check 'recursionSeparator' type value does not throw an error");

	});

});

describe("shortcut", () => {

	const Conf = new NodeConfManager(CONF_FILE);

	before(() => {

		return Promise.resolve().then(() => {
			return Conf.clear().deleteFile();
		}).catch((err) => {
			(0, console).log(err);
			return Promise.reject(err);
		});
	});

	beforeEach(() => {
		return Conf.clear();
	});

	after(() => {
		return Conf.clear().deleteFile();
	});


	it("should test wrong binds", () => {

		assert.throws(() => {
			Conf.shortcut(false, "t");
		}, Error, "check type value does not throw an error");

		assert.throws(() => {
			Conf.shortcut("", "t");
		}, Error, "check type value does not throw an error");

	});

	it("should bind shortcut", () => {

		assert.strictEqual(
			Conf.set("test", "test").shortcut("test", "t") instanceof NodeConfManager, true,
			"return data is not an instanceof NodeConfManager"
		);

		assert.strictEqual(
			Conf.set("test", "test").shortcut("TEST", "T") instanceof NodeConfManager, true,
			"return data is not an instanceof NodeConfManager"
		);

	});

});

describe("deleteFile", () => {

	after(() => {
		return new NodeConfManager().clear().deleteFile();
	});

	it("should delete file without file", () => {
		return new NodeConfManager().deleteFile();
	});

	it("should delete file with file", () => {
		return new NodeConfManager(CONF_FILE).deleteFile();
	});

	it("should delete file with saved file", () => {

		const Conf = new NodeConfManager(CONF_FILE);

		return Conf.save().then(() => {
			return Conf.deleteFile();
		});

	});

});

describe("fileExists", () => {

	after(() => {
		return new NodeConfManager().clear().deleteFile();
	});

	it("should check file existance without file", () => {

		return new NodeConfManager().fileExists().then((exists) => {
			assert.strictEqual(exists, false, "check file existance failed"); return Promise.resolve();
		});

	});

	it("should check file existance with file", () => {

		return new NodeConfManager(CONF_FILE).fileExists().then((exists) => {
			assert.strictEqual(exists, false, "check file existance failed"); return Promise.resolve();
		});

	});

	it("should check file existance with saved file", () => {

		const Conf = new NodeConfManager(CONF_FILE);

		return Conf.save().then(() => {

			return Conf.fileExists().then((exists) => {
				assert.strictEqual(exists, true, "check file existance failed"); return Promise.resolve();
			});

		});

	});

});

describe("save", () => {

	const Conf = new NodeConfManager(CONF_FILE);

	beforeEach(() => {
		return Conf.clear().deleteFile();
	});

	after(() => {
		return Conf.clear().deleteFile();
	});

	it("should save a configuration", () => {

		return Conf.fileExists().then((exists) => {

			assert.strictEqual(exists, false, "check file existance failed");

			return exists ? Promise.resolve() : Conf
				.set("usr", {
					"login": "login",
					"pwd": "pwd"
				})
				.set("debug", "n")
				.set("authors", [ "author1", "author2" ])
				.save();

		});

	});

	it("should save a configuration with spaces", () => {

		Conf.spaces = true;

		return Conf.fileExists().then((exists) => {

			assert.strictEqual(exists, false, "check file existance failed");

			return exists ? Promise.resolve() : Conf
				.set("usr", {
					"login": "login",
					"pwd": "pwd"
				})
				.set("debug", "n")
				.set("authors", [ "author1", "author2" ])
				.save();

		});

	});

	it("should save a configuration without file", () => {
		Conf._filePath = ""; return Conf.save();
	});

});

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
				return Conf.load();
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
		const argv = clone(process.argv);

		before(() => {
			return Conf.clear().skeleton("debug", "boolean").shortcut("debug", "d").shortcut("test", "t");
		});

		beforeEach(() => {
			process.argv = clone(argv);
			Conf.clearData();
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

				process.argv.push("--debug", "true");
				process.argv.push("--test", "test2");

				return Conf.load();

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

				process.argv.push("-d", "true");
				process.argv.push("-t", "test2");

				return Conf.load();

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

				process.argv.push("-d");

				return Conf.load();

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

				process.argv.push("--usr.login", "login2");
				process.argv.push("--lvl1.lvl2.lvl3", "test");

				return Conf.load();

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

describe("set", () => {

	const Conf = new NodeConfManager(CONF_FILE, true);

	before(() => {
		return Conf.clear().deleteFile();
	});

	after(() => {
		return Conf.clear().deleteFile();
	});

	it("should set a value", () => {

		assert.throws(() => {
			Conf.set(15);
		}, Error, "check type value does not throw an error");

	});

});

describe("get", () => {

	const Conf = new NodeConfManager(CONF_FILE, true);

	before(() => {
		return Conf.clear().deleteFile();
	});

	after(() => {
		return Conf.clear().deleteFile();
	});

	it("should get a value", () => {

		Conf.set("usr", {
			"login": "login",
			"pwd": "pwd"
		});

		const usr = Conf.get("usr");

		assert.strictEqual(usr.login, "login", "check file existance failed");

		usr.login = "login2";

		assert.strictEqual(usr.login, "login2", "check file existance failed");
		assert.strictEqual(Conf.get("usr").login, "login", "check file existance failed");

	});

});
