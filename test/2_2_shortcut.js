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
