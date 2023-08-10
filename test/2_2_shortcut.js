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

describe("shortcut", () => {

	const conf = new NodeConfManager(CONF_FILE);

	before(() => {

		conf.clear();

		return conf.deleteFile();

	});

	beforeEach(() => {
		conf.clear();
	});

	after(() => {

		conf.clear();

		return conf.deleteFile();

	});

	it("should test wrong binds", () => {

		assert.throws(() => {
			conf.shortcut(false, "t");
		}, Error, "check type value does not throw an error");

		assert.throws(() => {
			conf.shortcut("", "t");
		}, Error, "check type value does not throw an error");

	});

	it("should bind shortcut", () => {

		assert.strictEqual(
			conf.set("test", "test").shortcut("test", "t") instanceof NodeConfManager, true,
			"return data is not an instanceof NodeConfManager"
		);

		assert.strictEqual(
			conf.set("test", "test").shortcut("TEST", "T") instanceof NodeConfManager, true,
			"return data is not an instanceof NodeConfManager"
		);

	});

});
