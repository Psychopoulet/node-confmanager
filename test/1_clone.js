"use strict";

// deps

	// natives
	const { join } = require("path");
	const { strictEqual } = require("assert");

	// locals
	const clone = require(join(__dirname, "..", "lib", "cjs", "utils", "clone.js")).default;

// tests

describe("clone", () => {

	it("should test clone basic data", () => {
		strictEqual(clone(3.14), 3.14, "clone basic data is not working");
	});

	it("should test clone Object", () => {

		const test = { "test": "test" };
		const testCloned = clone(test);

		test.test = "test2";

		strictEqual(testCloned.test, "test", "clone Object is not working");

	});

	it("should test clone Date", () => {

		const test = new Date();
		const testCloned = clone(test);

		test.setFullYear(test.getFullYear() + 1);

		strictEqual(testCloned.getFullYear(), new Date().getFullYear(), "clone Date is not working");

	});

	it("should test clone Array", () => {

		const test = [ "test1", "test2" ];
		const testCloned = clone(test);

		test[0] = "test3";

		strictEqual(testCloned[0], "test1", "clone Array is not working");

	});

});
