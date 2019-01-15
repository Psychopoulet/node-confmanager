
"use strict";

// deps

	// natives
	const { writeFile } = require("fs");

// module

module.exports = (file, data, space = false) => {

	if ("undefined" === typeof file) {
		return Promise.reject(new ReferenceError("Missing \"file\" parameter"));
	}
	else if ("string" !== typeof file) {
		return Promise.reject(new TypeError("\"file\" parameter is not a string"));
	}
	else if ("" === file.trim()) {
		return Promise.reject(new Error("\"file\" parameter is empty"));
	}

	else {

		return Promise.resolve().then(() => {
			return Promise.resolve(JSON.stringify(data, null, space ? "  " : ""));
		}).then((content) => {

			return new Promise((resolve, reject) => {

				writeFile(file, content, "utf8", (err) => {
					return err ? reject(err) : resolve();
				});

			});

		});

	}

};
