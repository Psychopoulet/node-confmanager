"use strict";

// deps

	const { join } = require("path");
	const assert = require("assert");

	const fileExists = require(join(__dirname, "..", "lib", "fileExists.js"));

// consts

	const TEST_FILE = join(__dirname, "zjfzqluqnzoqzn");

// tests

describe("fileExists", () => {

	it("should test inexistant data", (done) => {

		fileExists().then(() => {
			done(new Error("inexistant data does not generate an error"));
		}).catch((err) => {

			assert.strictEqual(typeof err, "object", "inexistant data does not generate a valid error");
			assert.strictEqual(err instanceof ReferenceError, true, "inexistant data does not generate a valid error");

			done();

		});

	});

	it("should test wrong type data", (done) => {

		fileExists(false).then(() => {
			done(new Error("wrong type data does not generate an error"));
		}).catch((err) => {

			assert.strictEqual(typeof err, "object", "wrong type data does not generate a valid error");
			assert.strictEqual(err instanceof TypeError, true, "wrong type data does not generate a valid error");

			done();

		});

	});

	it("should test empty data", (done) => {

		fileExists("").then(() => {
			done(new Error("empty data does not generate an error"));
		}).catch((err) => {

			assert.strictEqual(typeof err, "object", "empty data does not generate a valid error");
			assert.strictEqual(err instanceof Error, true, "empty data does not generate a valid error");

			done();

		});

	});

	it("should test wrong file", () => {

		return fileExists(TEST_FILE).then((exists) => {

			assert.strictEqual(exists, false, "wrong file is not as expected");

			return Promise.resolve();

		});

	});

	it("should test good file", () => {

		return fileExists(__filename).then((exists) => {

			assert.strictEqual(exists, true, "good file is not as expected");

			return Promise.resolve();

		});

	});

});
