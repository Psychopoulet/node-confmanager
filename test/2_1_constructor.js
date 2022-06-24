"use strict";

// deps

	// natives
	const { join } = require("path");
	const assert = require("assert");

	// locals
	const NodeConfManager = require(join(__dirname, "..", "lib", "cjs", "main.cjs"));

// tests

describe("constructor", () => {

	it("should check filePath", () => {

		assert.throws(() => {
			new NodeConfManager(false).clear();
		}, TypeError, "check 'filePath' type value does not throw an error");

		assert.throws(() => {
			new NodeConfManager("").clear();
		}, Error, "check 'filePath' type value does not throw an error");

	});

	it("should check spaces", () => {

		assert.throws(() => {
			new NodeConfManager("test", "test").clear();
		}, TypeError, "check 'spaces' type value does not throw an error");

	});

	it("should check recursionSeparator", () => {

		assert.throws(() => {
			new NodeConfManager("test", false, false).clear();
		}, TypeError, "check 'recursionSeparator' type value does not throw an error");

		assert.throws(() => {
			new NodeConfManager("test", false, "").clear();
		}, Error, "check 'recursionSeparator' type value does not throw an error");

	});

});
