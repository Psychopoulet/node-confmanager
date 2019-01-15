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
