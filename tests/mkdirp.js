"use strict";

// deps

	const { join } = require("path");
	const { rmdir } = require("fs");

	const mkdirp = require(join(__dirname, "..", "lib", "mkdirp.js"));

// consts

	const TEST_DIRECTORY = join(__dirname, "zjfzqluqnzoqzn");

// tests

describe("mkdirp", () => {

	after((done) => {
		rmdir(TEST_DIRECTORY, done);
	});

	it("should test existant directory", () => {
		return mkdirp(__dirname);
	});

	it("should test inexistant directory", () => {
		return mkdirp(TEST_DIRECTORY);
	});

});
