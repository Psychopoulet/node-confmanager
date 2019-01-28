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
