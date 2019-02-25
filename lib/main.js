"use strict";

// deps

	// natives
	const { dirname, join } = require("path");

	// externals
	const { isFileProm, mkdirpProm, readJSONFileProm, unlinkProm, writeJSONFileProm } = require("node-promfs");

	// locals
	const checkShortcut = require(join(__dirname, "checkShortcut.js"));
	const clone = require(join(__dirname, "clone.js"));

// module

module.exports = class ConfManager extends require("node-containerpattern") {

	constructor (filePath, spaces = false, recursionSeparator = ".") {

		if ("undefined" !== typeof filePath && "string" !== typeof filePath) {
			throw new TypeError("\"filePath\" parameter is not a string");
		}
		else if ("undefined" !== typeof filePath && "" === filePath.trim()) {
			throw new Error("\"filePath\" parameter is empty");
		}

		else if ("undefined" !== typeof spaces && "boolean" !== typeof spaces) {
			throw new TypeError("The \"spaces\" parameter is not a boolean");
		}

		else if ("undefined" !== typeof recursionSeparator && "string" !== typeof recursionSeparator) {
			throw new TypeError("The \"recursionSeparator\" parameter is not a string");
		}
		else if ("undefined" !== typeof recursionSeparator && "" === recursionSeparator.trim()) {
			throw new Error("\"recursionSeparator\" parameter is empty");
		}

		else {

			super(recursionSeparator);

			this._filePath = "undefined" !== typeof filePath ? filePath.trim() : "";
			this._spaces = spaces;
			this._shortcuts = [];

		}

	}

	// private

	_loadFromConsole () {

		return Promise.resolve().then(() => {

			const args = (0, process).argv.slice(2, (0, process).argv.length);

			return !args.length ? Promise.resolve() : new Promise((resolve) => {

				for (let i = 0; i < args.length; ++i) {

					if (0 === args[i].indexOf("-")) {

						const isShortcut = -1 >= args[i].indexOf("--");
						const argument = args[i].slice(isShortcut ? 1 : 2, args[i].length);

						if (!isShortcut || this._shortcuts[argument]) {

							const key = isShortcut ? this._shortcuts[argument] : argument;

							if (i + 1 < args.length && -1 >= args[i + 1].indexOf("--")) {

								this.set(key, args[i + 1]);
								++i;

							}
							else if (this._skeletons[key] && "boolean" === this._skeletons[key]) {

								this.set(key, true);
								++i;

							}

						}

					}

				}

				resolve();

			});

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
		return !this._filePath ? Promise.resolve() : unlinkProm(this._filePath);
	}

	fileExists () {
		return !this._filePath ? Promise.resolve(false) : isFileProm(this._filePath);
	}

	load () {

		this.clearData();

		return this.fileExists().then((exists) => {

			return !exists ? this._loadFromConsole() : readJSONFileProm(this._filePath).then((data) => {

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

		return !this._filePath ? Promise.resolve() : mkdirpProm(dirname(this._filePath)).then(() => {

			const objects = {};
			this.forEach((value, key) => {
				objects[key] = value;
			});

			return this._spaces ?
				writeJSONFileProm(this._filePath, objects, null, 2) :
				writeJSONFileProm(this._filePath, objects);

		});

	}

	get (key) {
		return clone(super.get(key));
	}

};
