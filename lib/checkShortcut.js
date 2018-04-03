
"use strict";

// module

module.exports = (_key, _shortkey) => {

	if ("string" !== typeof _key) {
		throw new Error("The \"key\" argument is not a string");
	}
	else if ("string" !== typeof _shortkey) {
		throw new Error("The \"shortkey\" argument is not a string");
	}
	else {

		const key = _key.trim().toLowerCase();
		const shortkey = _shortkey.trim().toLowerCase();

		if ("" === key) {
			throw new Error("The \"key\" argument is empty");
		}
		else if ("" === shortkey) {
			throw new Error("The \"shortkey\" argument is empty");
		}
		else {

			return {
				key,
				shortkey
			};

		}

	}

};
