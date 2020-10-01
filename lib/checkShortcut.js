"use strict";

// module

module.exports = (key, shortkey) => {

	if ("undefined" === typeof key) {
		throw new ReferenceError("Missing \"key\" parameter");
	}
		else if ("string" !== typeof key) {
			throw new TypeError("\"key\" parameter is not a string");
		}
		else if ("" === key.trim()) {
			throw new RangeError("\"key\" parameter is empty");
		}

	else if ("undefined" === typeof shortkey) {
		throw new ReferenceError("Missing \"shortkey\" parameter");
	}
		else if ("string" !== typeof shortkey) {
			throw new TypeError("\"shortkey\" parameter is not a string");
		}
		else if ("" === shortkey.trim()) {
			throw new RangeError("\"shortkey\" parameter is empty");
		}

	else {

		return {
			"key": key.trim().toLowerCase(),
			"shortkey": shortkey.trim().toLowerCase()
		};

	}

};
