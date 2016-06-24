
"use strict";

// deps

const path = require("path"), fs = require("fs");

// private

	// methods

	function _isDirectory(dir) {

		return new Promise(function(resolve) {

			try {

				fs.stat(dir, function(err, stats) {
					resolve((err) ? false : stats.isDirectory());
				});

			}
			catch (e) {
				resolve(false);
			}

		});

	}

	function _clone(from) {

		let result;

			if (null === from || "object" !== typeof from) {
				result = from;
			}
			else if (-1 >= [Object, Array].indexOf(from.constructor)) {
				result = from;
			}
			else if (-1 < [Date, RegExp, Function, String, Number, Boolean].indexOf(from.constructor)) {
				result = new from.constructor(from);
			}
			else {

				result = new from.constructor();

				for (let name in from) {
					result[name] = ("undefined" === typeof result[name]) ? _clone(from[name], null) : result[name];
				}

			}

		return result;

	}

	function _mkdirp(dir) {

		return _isDirectory(dir).then(function(isDirectory) {

			if (isDirectory) {
				return Promise.resolve();
			}
			else {

				return _mkdirp(path.dirname(dir)).then(function() {

					return new Promise(function(resolve, reject) {

						try {

							fs.mkdir(dir, parseInt("0777", 8), function(err) {

								if (err) {
									reject((err.message) ? err.message : err);
								}
								else {
									resolve();
								}
								
							});

						}
						catch (e) {
							reject((e.message) ? e.message : e);
						}

					});

				});

			}

		});

	}

	function _loadFromConsole(that) {

		return new Promise(function(resolve) {

			if (2 <= process.argv.length) {

				for (let i = 2; i < process.argv.length; ++i) {

					if (0 === process.argv[i].indexOf("-") && i+1 < process.argv.length) {

						let key;

						if (0 === process.argv[i].indexOf("--")) {
							that.set(process.argv[i].slice(2, process.argv[i].length), process.argv[i+1]);
							++i;
						}
						else {

							key = process.argv[i].slice(1, process.argv[i].length);

							if (that.shortcuts && that.shortcuts[key]) {

								that.set(that.shortcuts[key], process.argv[i+1]);
								++i;

							}

						}

					}

				}

			}

			resolve();

		});

	}

	function _load(that) {

		that.clearData();

		return that.fileExists().then(function(exists) {

			if (!exists) {

				return _loadFromConsole(that).then(function() {
					return Promise.resolve();
				});

			}
			else {

				return new Promise(function(resolve, reject) {

					try {

						fs.readFile(that.filePath, "utf8", function(err, data) {

							if (err) {
								reject((err.message) ? err.message : err);
							}
							else {

								try {

									data = JSON.parse(data);

									that.clearData();
									for (let key in data) {
										that.set(key, data[key]);
									}

									_loadFromConsole(that).then(resolve).catch(reject);

								}
								catch (e) {
									reject((e.message) ? e.message : e);
								}

							}

						});
						
					}
					catch(e) {
						reject((e.message) ? e.message : e);
					}
				
				});

			}

		});

	}

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

			this.filePath = ("string" === typeof filePath && "" != filePath.trim()) ? filePath.trim() : path.join(__dirname, "..", "conf", "conf.json");
			this.spaces = ("boolean" === typeof spaces) ? spaces : false;
			this.shortcuts = [];

		}
		
	}

	bindShortcut(key, shortkey) {

		if ("string" !== typeof key) {
			throw new Error("The \"key\" argument is not a string");
		}
		else if ("string" !== typeof shortkey) {
			throw new Error("The \"shortkey\" argument is not a string");
		}
		else {

			key = key.trim().toLowerCase();
			shortkey = shortkey.trim().toLowerCase();

			if ("" === key) {
				throw new Error("The \"key\" argument is empty");
			}
			else if ("" === shortkey) {
				throw new Error("The \"shortkey\" argument is empty");
			}
			else {
				this.shortcuts[shortkey] = key;
			}

		}

		return this;

	}

	clearShortcuts() {
		this.shortcuts = [];
		return this;
	}

	clear() {
		super.clear();
		return this.clearShortcuts();
	}

	deleteFile () {

		let that = this;
		return this.fileExists().then(function(exists) {

			if (!exists) {
				return Promise.resolve();
			}
			else {

				return new Promise(function(resolve, reject) {

					try {

						fs.unlink(that.filePath, function(err) {

							if (err) {
								reject((err.message) ? err.message : err);
							}
							else {
								resolve();
							}
							
						});
						
					}
					catch (e) {
						reject((e.message) ? e.message : e);
					}

				});
					
			}

		});

	}

	fileExists () {

		let filePath = this.filePath;
		return new Promise(function(resolve) {

			try {

				fs.lstat(filePath, function(err, stats) {
					resolve((err) ? false : stats.isFile());
				});

			}
			catch (e) {
				resolve(false);
			}

		});

	}

	load () {

		if (this.savingPromise) {

			(1, console).log("test");

			let that = this;
			return this.savingPromise.then(function() {
				return _load(that);
			});

		}
		else {
			return _load(this);
		}

	}

	save () {

		let that = this;
		return _mkdirp(path.dirname(this.filePath)).then(function() {

			return new Promise(function(resolve, reject) {

				try {

					let objects = {};
					that.forEach(function(value, key) { objects[key] = value; });

					fs.writeFile(that.filePath, JSON.stringify(objects, null, (that.spaces) ? "  " : ""), "utf8", function(err) {

						if (err) {
							reject((err.message) ? err.message : err);
						}
						else {
							resolve();
						}

					});

				}
				catch (e) {
					reject((e.message) ? e.message : e);
				}
					
			});

		});

	}

	get (key) {
		return _clone(super.get(key));
	}

};
