"use strict";

// deps

	const { join } = require("path");
	const { strictEqual } = require("assert");

	const writeJSONFile = require(join(__dirname, "..", "lib", "writeJSONFile.js"));
	const unlink = require(join(__dirname, "..", "lib", "unlink.js"));

// consts

	const TEST_FILE = join(__dirname, "zjfzqluqnzoqzn");
	const CONTENT = { "test": "test" };

// tests

describe("writeJSONFile", () => {

	after(() => {
		return unlink(TEST_FILE);
	});

	it("should test inexistant data", (done) => {

		writeJSONFile().then(() => {
			done(new Error("inexistant data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "inexistant data does not generate a valid error");
			strictEqual(err instanceof ReferenceError, true, "inexistant data does not generate a valid error");

			done();

		});

	});

	it("should test wrong type data", (done) => {

		writeJSONFile(false).then(() => {
			done(new Error("wrong type data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "wrong type data does not generate a valid error");
			strictEqual(err instanceof TypeError, true, "wrong type data does not generate a valid error");

			done();

		});

	});

	it("should test empty data", (done) => {

		writeJSONFile("").then(() => {
			done(new Error("empty data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "empty data does not generate a valid error");
			strictEqual(err instanceof Error, true, "empty data does not generate a valid error");

			done();

		});

	});

	it("should test good file", () => {
		return writeJSONFile(TEST_FILE, CONTENT);
	});

	it("should test good file", () => {
		return writeJSONFile(TEST_FILE, CONTENT, true);
	});

});
