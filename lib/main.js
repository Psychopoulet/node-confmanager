
"use strict";

// deps

	const { dirname, join } = require("path");
	const fs = require("fs");

	const checkShortcut = require(join(__dirname, "checkShortcut.js"));
	const clone = require(join(__dirname, "clone.js"));
	const fileExists = require(join(__dirname, "fileExists.js"));
	const mkdirp = require(join(__dirname, "mkdirp.js"));

// module

module.exports = class ConfManager extends require("node-containerpattern") {

	constructor (filePath, spaces, commandlineSeparator) {

		if ("undefined" !== typeof filePath && "string" !== typeof filePath) {
			throw new Error("The \"filePath\" argument is not a string");
		}
		else if ("undefined" !== typeof spaces && "boolean" !== typeof spaces) {
			throw new Error("The \"spaces\" argument is not a boolean");
		}
		else if ("undefined" !== typeof commandlineSeparator && "string" !== typeof commandlineSeparator) {
			throw new Error("The \"commandlineSeparator\" is not a string");
		}
		else {

			super(commandlineSeparator);

			this.filePath = "string" === typeof filePath && "" !== filePath.trim() ? filePath.trim() : join(__dirname, "..", "conf", "conf.json");
			this.spaces = "boolean" === typeof spaces ? spaces : false;
			this.shortcuts = [];

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

						if (!isShortcut || this.shortcuts[argument]) {

							const key = isShortcut ? this.shortcuts[argument] : argument;

							if (i + 1 < process.argv.length && -1 >= process.argv[i + 1].indexOf("--")) {

								this.set(key, process.argv[i + 1]);
								++i;

							}
							else if (this.skeletons[key] && "boolean" === this.skeletons[key]) {

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

		this.shortcuts[shortkey] = key;

		return this;

	}

	clearShortcuts () {
		this.shortcuts = [];
		return this;
	}

	clear () {
		super.clear();
		return this.clearShortcuts();
	}

	deleteFile () {

		return this.fileExists().then((exists) => {

			return !exists ? Promise.resolve() : new Promise((resolve, reject) => {

				fs.unlink(this.filePath, (err) => {
					return err ? reject(err) : resolve();
				});

			});

		});

	}

	fileExists () {
		return fileExists(this.filePath);
	}

	load () {

		this.clearData();

		return this.fileExists().then((exists) => {

			return !exists ? this._loadFromConsole() : new Promise((resolve, reject) => {

				fs.readFile(this.filePath, "utf8", (err, data) => {
					return err ? reject(err) : resolve(data);
				});

			}).then((data) => {
				return Promise.resolve(JSON.parse(data));
			}).then((data) => {

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

		return mkdirp(dirname(this.filePath)).then(() => {

			return new Promise((resolve, reject) => {

				const objects = {};
				this.forEach((value, key) => {
					objects[key] = value;
				});

				fs.writeFile(this.filePath, JSON.stringify(objects, null, this.spaces ? "  " : ""), "utf8", (err) => {
					return err ? reject(err) : resolve();
				});

			});

		});

	}

	get (key) {
		return clone(super.get(key));
	}

};
