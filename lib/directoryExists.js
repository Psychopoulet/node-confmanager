
"use strict";

// deps

	// natives
	const { stat } = require("fs");

// module

module.exports = (dir) => {

	if ("undefined" === typeof dir) {
		return Promise.reject(new ReferenceError("Missing \"dir\" parameter"));
	}
	else if ("string" !== typeof dir) {
		return Promise.reject(new TypeError("\"dir\" parameter is not a string"));
	}
	else if ("" === dir.trim()) {
		return Promise.reject(new Error("\"dir\" parameter is empty"));
	}

	else {

		return new Promise((resolve) => {

			stat(dir, (err, stats) => {
				resolve(err ? false : stats.isDirectory());
			});

		});

	}

};
