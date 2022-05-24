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

	describe("without file", () => {

		const conf = new NodeConfManager();

		it("should save a configuration", () => {

			return conf.fileExists().then((exists) => {

				assert.strictEqual(exists, false, "check file existance failed");

				return conf.save();

			});

		});

	});

	describe("with file", () => {

		const conf = new NodeConfManager(CONF_FILE);

		beforeEach(() => {

			conf.clear();

			return conf.deleteFile();

		});

		after(() => {

			conf.clear();

			return conf.deleteFile();

		});

		it("should save a configuration", () => {

			return conf.fileExists().then((exists) => {

				assert.strictEqual(exists, false, "check file existance failed");

				return exists ? Promise.resolve() : conf
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

			conf.spaces = true;

			return conf.fileExists().then((exists) => {

				assert.strictEqual(exists, false, "check file existance failed");

				return exists ? Promise.resolve() : conf
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

			conf._filePath = "";

			return conf.save();

		});

	});

});
