"use strict";

// deps

	// natives
	const { join } = require("node:path");
	const assert = require("node:assert");

	// locals
	const NodeConfManager = require(join(__dirname, "..", "lib", "cjs", "main.cjs"));

// consts

	const CONF_FILE = join(__dirname, "conf.json");

// tests

describe("get", () => {

	const conf = new NodeConfManager(CONF_FILE, true);

	before(() => {

		conf.clear();

		return conf.deleteFile();

	});

	after(() => {

		conf.clear();

		return conf.deleteFile();

	});

	it("should get a value", () => {

		conf.set("usr", {
			"login": "login",
			"pwd": "pwd"
		});

		const usr = conf.get("usr");

		assert.strictEqual(usr.login, "login", "check file existance failed");

		usr.login = "login2";

		assert.strictEqual(usr.login, "login2", "check file existance failed");
		assert.strictEqual(conf.get("usr").login, "login", "check file existance failed");

	});

});
