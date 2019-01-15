"use strict";

// deps

	// natives
	const { join } = require("path");
	const assert = require("assert");

	// locals
	const checkShortcut = require(join(__dirname, "..", "lib", "checkShortcut.js"));

// tests

describe("checkShortcut", () => {

	it("should test inexistant data", () => {

		assert.throws(() => {
			checkShortcut();
		}, "inexistant data does not throws an error");

		assert.throws(() => {
			checkShortcut("test");
		}, "inexistant data does not throws an error");

	});

	it("should test wrong type data", () => {

		assert.throws(() => {
			checkShortcut(false);
		}, "inexistant data does not throws an error");

		assert.throws(() => {
			checkShortcut("test", false);
		}, "inexistant data does not throws an error");

	});

	it("should test empty data", () => {

		assert.throws(() => {
			checkShortcut("");
		}, "inexistant data does not throws an error");

		assert.throws(() => {
			checkShortcut("test", "");
		}, "inexistant data does not throws an error");

	});

	it("should test wrong-formated data", () => {

		const { key, shortkey } = checkShortcut("test ", "TEST");

		assert.strictEqual(typeof key, "string", "wrong-formated data does not generate valid data");
		assert.strictEqual(key, "test", "wrong-formated data does not generate valid data");

		assert.strictEqual(typeof shortkey, "string", "wrong-formated data does not generate valid data");
		assert.strictEqual(shortkey, "test", "wrong-formated data does not generate valid data");

	});

	it("should test good data", () => {

		const { key, shortkey } = checkShortcut("test", "test");

		assert.strictEqual(typeof key, "string", "wrong-formated data does not generate valid data");
		assert.strictEqual(key, "test", "wrong-formated data does not generate valid data");

		assert.strictEqual(typeof shortkey, "string", "wrong-formated data does not generate valid data");
		assert.strictEqual(shortkey, "test", "wrong-formated data does not generate valid data");

	});

});
