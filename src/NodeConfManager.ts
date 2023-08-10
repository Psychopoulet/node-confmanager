"use strict";

// deps

	// natives
	import { dirname } from "node:path";
	import { unlink, readFile, writeFile, mkdir } from "node:fs/promises";

	// externals
	import NodeContainerPattern = require("node-containerpattern");

	// locals
	import checkShortcut from "./utils/checkShortcut";
	import clone from "./utils/clone";
	import isFile from "./utils/isFile";

// module

export default class ConfManager extends NodeContainerPattern {

	// attributes

		// public

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

	private _loadFromConsole (): void {

		process.argv.slice(2, process.argv.length).forEach((arg: string, i: number, args: Array<string>): void => {

			if ("--" === arg) {
				return;
			}

			if (arg.startsWith("-")) {

				const isShortcut: boolean = !arg.startsWith("--");
				const argument: string = arg.slice(isShortcut ? 1 : 2, arg.length);

				if (argument && (!isShortcut || this.shortcuts[argument])) {

					const key: string = isShortcut ? this.shortcuts[argument] : argument;

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
                    else if (this.skeletons[key] && "array" === this.skeletons[key]) {

                        const nextArgs: Array<string> = args.slice(i + 1, args.length);

                        if (!nextArgs.length) {
                            this.set(key, []);
                        }
                        else {

                            const endArrayArgs: number = nextArgs.findIndex((a: string): boolean => {

                                return  a.startsWith("--") ||
                                    (a.startsWith("-") && !!this.shortcuts[a.slice(1)]);

                            });

							const values: Array<string> = 0 < endArrayArgs ? nextArgs.slice(0, endArrayArgs) : nextArgs;

							if (1 === values.length && values[0].startsWith("[") && values[0].endsWith("]")) {
                                this.set(key, values[0]);
							}
							else {
                                this.set(key, values);
							}

                        }

                    }
					else {
						this.set(key, args[i + 1]);
					}

				}

			}

		});

	}

	// public

	// Container.clear & clearShortcuts
	public clear (): void {
		super.clear();
		this.clearShortcuts();
	}

	// forget all the shortcuts
	public clearShortcuts (): this {
		this.shortcuts = {};
		return this;
	}

	// delete the conf file
	public deleteFile (): Promise<void> {

		return !this.filePath ? Promise.resolve() : isFile(this.filePath).then((exists: boolean): Promise<void> => {
			return exists ? unlink(this.filePath) : Promise.resolve();
		});

	}

	// check if the conf file exists
	public fileExists (): Promise<boolean> {
		return !this.filePath ? Promise.resolve(false) : isFile(this.filePath);
	}

	// Container.get with cloned data
	public get (key: string): any {
		return clone(super.get(key));
	}

	// load data from conf file then commandline (commandline takeover)
	public load (loadConsole: boolean = true): Promise<void> {

		this.clearData();

		return this.fileExists().then((exists: boolean): Promise<void> | void => {

			if (!exists) {

				if (loadConsole) {
					this._loadFromConsole();
				}

			}
			else {

				return readFile(this.filePath, "utf8").then((content: string): { [key: string]: any } => {
					return JSON.parse(content);
				}).then((data: { [key: string]: any }): void => {

					for (const key in data) {
						this.set(key, data[key]);
					}

					if (loadConsole) {
						this._loadFromConsole();
					}

				});

			}

		});

	}

	// save data into conf file
	public save (): Promise<void> {

		return !this.filePath ? Promise.resolve() : mkdir(dirname(this.filePath), {
			"recursive": true
		}).then((): Promise<void> => {

			const objects: { [key:string]: any } = {};
			this.forEach((value: any, key: string): void => {
				objects[key] = value;
			});

			return this.spaces ?
				writeFile(this.filePath, JSON.stringify(objects, undefined, 2), "utf8") :
				writeFile(this.filePath, JSON.stringify(objects), "utf8");

		});

	}

	// bind a shortcut for commandline
	public shortcut (_key: string, _shortkey: string): this {

		const { key, shortkey }: { "key": string; "shortkey": string; } = checkShortcut(_key, _shortkey);

		this.shortcuts[shortkey] = key;

		return this;

	}

};
