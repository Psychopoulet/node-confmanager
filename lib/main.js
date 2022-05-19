"use strict";

// deps

	// natives
	const { dirname, join } = require("path");

	// externals
	const { pathExists, mkdirp, readJson, unlink, writeJson } = require("fs-extra");
	const Container = require("node-containerpattern");

	// locals
	const checkShortcut = require(join(__dirname, "checkShortcut.js"));
	const clone = require(join(__dirname, "clone.js"));

// module

module.exports = class ConfManager extends Container {

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

			this.filePath = "undefined" !== typeof filePath ? filePath.trim() : "";
			this.spaces = spaces;
			this.shortcuts = [];

		}

	}

	// private

	_loadFromConsole () {

		return Promise.resolve().then(() => {

			(0, process).argv.slice(2, (0, process).argv.length).forEach((arg, i, args) => {

				if (arg.startsWith("-")) {

					const isShortcut = !arg.startsWith("--");

					const argument = arg.slice(isShortcut ? 1 : 2, arg.length);

					if (!isShortcut || this.shortcuts[argument]) {

						const key = isShortcut ? this.shortcuts[argument] : argument;

						if (i + 1 < args.length && -1 >= args[i + 1].indexOf("--")) {
							this.set(key, args[i + 1]);
						}
						else if (this.skeletons[key] && "boolean" === this.skeletons[key]) {
							this.set(key, true);
						}

					}

				}

			});

			return Promise.resolve();

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

		return !this.filePath ? Promise.resolve() : pathExists(this.filePath).then((exists) => {
			return exists ? unlink(this.filePath) : Promise.resolve();
		});

	}

	fileExists () {
		return !this.filePath ? Promise.resolve(false) : pathExists(this.filePath);
	}

	load () {

		this.clearData();

		return this.fileExists().then((exists) => {

			return !exists ? this._loadFromConsole() : readJson(this.filePath, "utf8").then((data) => {

				for (const key in data) {
					this.set(key, data[key]);
				}

				return this._loadFromConsole();

			});

		});

	}

	save () {

		return !this.filePath ? Promise.resolve() : mkdirp(dirname(this.filePath)).then(() => {

			const objects = {};
			this.forEach((value, key) => {
				objects[key] = value;
			});

			return this.spaces ? writeJson(this.filePath, objects, {
				"encoding": "utf8",
				"space": 2
			}) : writeJson(this.filePath, objects, {
				"encoding": "utf8"
			});

		});

	}

	get (key) {
		return clone(super.get(key));
	}

};
