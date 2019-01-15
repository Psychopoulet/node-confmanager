/*
	eslint no-implicit-globals: 0
*/

"use strict";

// deps

	// natives
	const { dirname, join } = require("path");
	const { mkdir } = require("fs");

	// locals
	const directoryExists = require(join(__dirname, "directoryExists.js"));

// private

	// methods

		/**
		* Create directory recursively
		* @param {string} dir Directory to create
		* @returns {Promise} Operation result
		*/
		function mkdirp (dir) {

			return directoryExists(dir).then((exists) => {

				return exists ? Promise.resolve() : mkdirp(dirname(dir)).then(() => {

					return new Promise((resolve, reject) => {

						// 511 == parseInt("0777", 8)
						mkdir(dir, 511, (err) => {
							return err ? reject(err) : resolve();
						});

					});

				});

			});

		}

// module

module.exports = mkdirp;
