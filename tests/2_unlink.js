"use strict";

// deps

	const { join } = require("path");
	const { writeFile } = require("fs");
	const { strictEqual } = require("assert");

	const unlink = require(join(__dirname, "..", "lib", "unlink.js"));

// consts

	const TEST_FILE = join(__dirname, "zjfzqluqnzoqzn");

// tests

describe("unlink", () => {

	before(() => {

		return new Promise((resolve, reject) => {

			writeFile(TEST_FILE, "{ \"test\": \"test\" }", "utf8", (err) => {
				return err ? reject(err) : resolve();
			});

		});

	});

	it("should test inexistant data", (done) => {

		unlink().then(() => {
			done(new Error("inexistant data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "inexistant data does not generate a valid error");
			strictEqual(err instanceof ReferenceError, true, "inexistant data does not generate a valid error");

			done();

		});

	});

	it("should test wrong type data", (done) => {

		unlink(false).then(() => {
			done(new Error("wrong type data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "wrong type data does not generate a valid error");
			strictEqual(err instanceof TypeError, true, "wrong type data does not generate a valid error");

			done();

		});

	});

	it("should test empty data", (done) => {

		unlink("").then(() => {
			done(new Error("empty data does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "empty data does not generate a valid error");
			strictEqual(err instanceof Error, true, "empty data does not generate a valid error");

			done();

		});

	});

	it("should test wrong file", () => {
		return unlink(TEST_FILE + "test");
	});

	it("should test good file", () => {
		return unlink(TEST_FILE);
	});

});
