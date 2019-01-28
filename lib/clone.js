"use strict";

// private

	// methods

		/**
		* Clone data
		* @param {any} from Data to clone.
		* @returns {any} Cloned data
		*/
		function clone (from) {

			if (from && "object" === typeof from) {

				if (Object === from.constructor) {

					const result = new from.constructor();

						for (const name in from) {

							if (Object.prototype.hasOwnProperty.call(from, name)) {
								result[name] = clone(from[name]);
							}

						}

					return result;

				}
				else if (Array === from.constructor) {

					const result = new from.constructor();

						for (let i = 0; i < from.length; ++i) {
							result[i] = clone(from[i]);
						}

					return result;

				}
				else {
					return new from.constructor(from);
				}

			}
			else {
				return from;
			}

		}

// module

module.exports = clone;
