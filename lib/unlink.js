
"use strict";

// deps

	const { unlink } = require("fs");

	const fileExists = require(require("path").join(__dirname, "fileExists.js"));

// module

module.exports = (file) => {

	return fileExists(file).then((exists) => {

		return !exists ? Promise.resolve() : new Promise((resolve, reject) => {

			unlink(file, (err) => {
				return err ? reject(err) : resolve();
			});

		});

	});

};
