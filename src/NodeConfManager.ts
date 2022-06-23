"use strict";

// deps

	// natives
	import { dirname, join } from "path";

	// externals
	import { pathExists, mkdirp, readJson, unlink, writeJson } from "fs-extra";
	import NodeContainerPattern = require("node-containerpattern");

	// locals
	import checkShortcut from "./utils/checkShortcut";
	import clone from "./utils/clone";

// module

export default class ConfManager extends NodeContainerPattern {

	// private

		// attributes

		public filePath: string;
		public spaces: boolean;
		public shortcuts: { [key:string]: string };

	// constructor

	public constructor (filePath: string, spaces: boolean = false, recursionSeparator: string = ".") {

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
			this.shortcuts = {};

		}

	}

	// private

	private _loadFromConsole (): Promise<void> {

		return Promise.resolve().then(() => {

			(0, process).argv.slice(2, (0, process).argv.length).forEach((arg, i, args) => {

				if (arg.startsWith("-")) {

					const isShortcut = !arg.startsWith("--");
					const argument = arg.slice(isShortcut ? 1 : 2, arg.length);

					if (argument && (!isShortcut || this.shortcuts[argument])) {

						const key = isShortcut ? this.shortcuts[argument] : argument;

						if (this.skeletons[key] && "boolean" === this.skeletons[key]) {
							this.set(key, true);
						}
						else if (i + 1 >= args.length) {
							throw new ReferenceError("Missing value for \"" + argument + "\" key (no more arguments)");
						}
						else if (args[i + 1].startsWith("--")) {
							throw new ReferenceError("Missing value for \"" + argument + "\" key (next argument is a valid key)");
						}
						else if (args[i + 1].startsWith("-") && this.shortcuts[args[i + 1].slice(1)]) {
							throw new ReferenceError("Missing value for \"" + argument + "\" key (next argument is a valid shortcut)");
						}
						else {
							this.set(key, args[i + 1]);
						}

					}

				}

			});

			return Promise.resolve();

		});

	}

	// public

	// Container.clear & clearShortcuts
	public clear () {
		super.clear();
		this.clearShortcuts();
	}

	// forget all the shortcuts
	public clearShortcuts () {
		this.shortcuts = {};
		return this;
	}

	// delete the conf file
	public deleteFile () {

		return !this.filePath ? Promise.resolve() : pathExists(this.filePath).then((exists) => {
			return exists ? unlink(this.filePath) : Promise.resolve();
		});

	}

	// check if the conf file exists
	public fileExists () {
		return !this.filePath ? Promise.resolve(false) : pathExists(this.filePath);
	}

	// Container.get with cloned data
	public get (key: string) {
		return clone(super.get(key));
	}

	// load data from conf file then commandline (commandline takeover)
	public load () {

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

	// save data into conf file
	public save () {

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

	// bind a shortcut for commandline
	public shortcut (_key: string, _shortkey: string) {

		const { key, shortkey } = checkShortcut(_key, _shortkey);

		this.shortcuts[shortkey] = key;

		return this;

	}

};
