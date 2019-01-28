"use strict";

// deps

	// natives
	const { join } = require("path");
	const assert = require("assert");

	// locals
	const NodeConfManager = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const CONF_FILE = join(__dirname, "conf.json");

// tests

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
