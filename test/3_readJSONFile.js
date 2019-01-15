"use strict";

// deps

	const { join } = require("path");
	const { writeFile } = require("fs");
	const { deepStrictEqual, strictEqual } = require("assert");

	const readJSONFile = require(join(__dirname, "..", "lib", "readJSONFile.js"));
	const unlink = require(join(__dirname, "..", "lib", "unlink.js"));

// consts

	const TEST_FILE = join(__dirname, "zjfzqluqnzoqzn");
	const CONTENT = { "test": "test" };

// tests

describe("readJSONFile", () => {

	before(() => {

		return new Promise((resolve, reject) => {

			writeFile(TEST_FILE, JSON.stringify(CONTENT), "utf8", (err) => {
				return err ? reject(err) : resolve();
			});

		});

	});

	after(() => {
		return unlink(TEST_FILE);
	});

	it("should test inexistant data", (done) => {

		readJSONFile().then(() => {
			done(new Error("inexistant data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "inexistant data does not generate a valid error");
			strictEqual(err instanceof ReferenceError, true, "inexistant data does not generate a valid error");

			done();

		});

	});

	it("should test wrong type data", (done) => {

		readJSONFile(false).then(() => {
			done(new Error("wrong type data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "wrong type data does not generate a valid error");
			strictEqual(err instanceof TypeError, true, "wrong type data does not generate a valid error");

			done();

		});

	});

	it("should test empty data", (done) => {

		readJSONFile("").then(() => {
			done(new Error("empty data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "empty data does not generate a valid error");
			strictEqual(err instanceof Error, true, "empty data does not generate a valid error");

			done();

		});

	});

	it("should test wrong file", (done) => {

		readJSONFile(__filename).then(() => {
			done(new Error("No error generated"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "wrong file is not as expected");
			strictEqual(err instanceof Error, true, "wrong file is not as expected");

			done();

		});

	});

	it("should test good file", () => {

		return readJSONFile(TEST_FILE).then((content) => {

			strictEqual(typeof content, "object", "good file is not as expected");
			deepStrictEqual(content, CONTENT, "good file is not as expected");

			return Promise.resolve();

		});

	});

});
