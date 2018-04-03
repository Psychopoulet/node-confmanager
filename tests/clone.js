"use strict";

// deps

	const { join } = require("path");
	const assert = require("assert");

	const clone = require(join(__dirname, "..", "lib", "clone.js"));

// tests

describe("clone", () => {

	it("should test clone basic data", () => {
		assert.strictEqual(clone(3.14), 3.14, "clone basic data is not working");
	});

	it("should test clone object", () => {

		const test = new Date();
		const testCloned = clone(test);

		test.setFullYear(test.getFullYear() + 1);

		assert.strictEqual(testCloned.getFullYear(), new Date().getFullYear(), "clone object is not working");

	});

	it("should test clone array", () => {

		const test = [ "test1", "test2" ];
		const testCloned = clone(test);

		test[0] = "test3";

		assert.strictEqual(testCloned[0], "test1", "clone array is not working");

	});

});
