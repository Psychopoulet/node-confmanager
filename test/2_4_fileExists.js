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
