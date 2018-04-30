
"use strict";

// deps

	const { dirname, join } = require("path");

	const checkShortcut = require(join(__dirname, "checkShortcut.js"));
	const clone = require(join(__dirname, "clone.js"));
	const fileExists = require(join(__dirname, "fileExists.js"));
	const readJSONFile = require(join(__dirname, "readJSONFile.js"));
	const mkdirp = require(join(__dirname, "mkdirp.js"));
	const unlink = require(join(__dirname, "unlink.js"));
	const writeJSONFile = require(join(__dirname, "writeJSONFile.js"));

// module

module.exports = class ConfManager extends require("node-containerpattern") {

	constructor (filePath, spaces = false, recursionSeparator = ".") {

		if ("undefined" === typeof filePath) {
			throw new ReferenceError("Missing \"filePath\" parameter");
		}
			else if ("string" !== typeof filePath) {
				throw new TypeError("\"filePath\" parameter is not a string");
			}
			else if ("" === filePath.trim()) {
				throw new Error("\"filePath\" parameter is empty");
			}

		else if ("undefined" !== typeof spaces && "boolean" !== typeof spaces) {
			throw new TypeError("The \"spaces\" parameter is not a boolean");
		}
		else if ("undefined" !== typeof recursionSeparator && "string" !== typeof recursionSeparator) {
			throw new TypeError("The \"recursionSeparator\" parameter is not a string");
		}

		else {

			super(recursionSeparator);

			this._filePath = filePath.trim();
			this._spaces = spaces;
			this._shortcuts = [];

		}

	}

	// private

	_loadFromConsole () {

		return new Promise((resolve) => {

			if (2 <= process.argv.length) {

				for (let i = 2; i < process.argv.length; ++i) {

					if (0 === process.argv[i].indexOf("-")) {

						const isShortcut = -1 >= process.argv[i].indexOf("--");
						const argument = process.argv[i].slice(isShortcut ? 1 : 2, process.argv[i].length);

						if (!isShortcut || this._shortcuts[argument]) {

							const key = isShortcut ? this._shortcuts[argument] : argument;

							if (i + 1 < process.argv.length && -1 >= process.argv[i + 1].indexOf("--")) {

								this.set(key, process.argv[i + 1]);
								++i;

							}
							else if (this._skeletons[key] && "boolean" === this._skeletons[key]) {

								this.set(key, true);
								++i;

							}

						}

					}

				}

			}

			resolve();

		});

	}

	shortcut (_key, _shortkey) {

		const { key, shortkey } = checkShortcut(_key, _shortkey);

		this._shortcuts[shortkey] = key;

		return this;

	}

	clearShortcuts () {
		this._shortcuts = [];
		return this;
	}

	clear () {
		super.clear();
		return this.clearShortcuts();
	}

	deleteFile () {
		return unlink(this._filePath);
	}

	fileExists () {
		return fileExists(this._filePath);
	}

	load () {

		this.clearData();

		return this.fileExists().then((exists) => {

			return !exists ? this._loadFromConsole() : readJSONFile(this._filePath).then((data) => {

				for (const key in data) {

					if (Object.prototype.hasOwnProperty.call(data, key)) {
						this.set(key, data[key]);
					}

				}

				return this._loadFromConsole();

			});

		});

	}

	save () {

		return mkdirp(dirname(this._filePath)).then(() => {

			const objects = {};
			this.forEach((value, key) => {
				objects[key] = value;
			});

			return writeJSONFile(this._filePath, objects, this._spaces);

		});

	}

	get (key) {
		return clone(super.get(key));
	}

};
