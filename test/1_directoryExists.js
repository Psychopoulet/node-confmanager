"use strict";

// deps

	// natives
	const { join } = require("path");
	const { strictEqual } = require("assert");

	// locals
	const directoryExists = require(join(__dirname, "..", "lib", "directoryExists.js"));

// consts

	const TEST_DIRECTORY = join(__dirname, "zjfzqluqnzoqzn");

// tests

describe("directoryExists", () => {

	it("should test inexistant data", (done) => {

		directoryExists().then(() => {
			done(new Error("inexistant data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "inexistant data does not generate a valid error");
			strictEqual(err instanceof ReferenceError, true, "inexistant data does not generate a valid error");

			done();

		});

	});

	it("should test wrong type data", (done) => {

		directoryExists(false).then(() => {
			done(new Error("wrong type data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "wrong type data does not generate a valid error");
			strictEqual(err instanceof TypeError, true, "wrong type data does not generate a valid error");

			done();

		});

	});

	it("should test empty data", (done) => {

		directoryExists("").then(() => {
			done(new Error("empty data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "empty data does not generate a valid error");
			strictEqual(err instanceof Error, true, "empty data does not generate a valid error");

			done();

		});

	});

	it("should test wrong directory", () => {

		return directoryExists(TEST_DIRECTORY).then((exists) => {

			strictEqual(exists, false, "wrong directory is not as expected");

			return Promise.resolve();

		});

	});

	it("should test good directory", () => {

		return directoryExists(__dirname).then((exists) => {

			strictEqual(exists, true, "good directory is not as expected");

			return Promise.resolve();

		});

	});

});
