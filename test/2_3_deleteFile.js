"use strict";

// deps

	// natives
	const { join } = require("path");

	// locals
	const NodeConfManager = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const CONF_FILE = join(__dirname, "conf.json");

// tests

describe("deleteFile", () => {

	after(() => {

		const conf = new NodeConfManager(CONF_FILE);

		conf.clear();

		return conf.deleteFile();

	});

	it("should delete file without file", () => {
		return new NodeConfManager().deleteFile();
	});

	it("should delete file with file", () => {
		return new NodeConfManager(CONF_FILE).deleteFile();
	});

	it("should delete file with saved file", () => {

		const Conf = new NodeConfManager(CONF_FILE);

		return Conf.save().then(() => {
			return Conf.deleteFile();
		});

	});

});
