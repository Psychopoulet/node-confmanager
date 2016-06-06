
"use strict";

// const

const path = require("path"), fs = require("fs");

// private

	// attributess

	var _savingPromise = false,
		_filePath = path.join(__dirname, "..", "conf", "conf.json"),
		_spaces = false,
		_shortcuts = [];

	// methods

	function _isDirectory(dir) {
		try {
			return (fs.lstatSync(dir).isDirectory());
		}
		catch (e) {
			return false;
		}
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

	function _mkdirp(dir, callback) {

		try {

			if (_isDirectory(dir)) {
				callback(null);
			}
			else {

				_mkdirp(path.dirname(dir), function(err) {

					if (err) {
						callback(err);
					}
					else {

						fs.mkdir(dir, parseInt("0777", 8), function(err) {

							if (err) {
								callback((err.message) ? err.message : err);
							}
							else {
								callback(null);
							}
							
						});

					}
					
				});

			}

		}
		catch (e) {
			callback((e.message) ? e.message : e);
		}

	}

	function _loadFromConsole(that) {

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

						if (_shortcuts && _shortcuts[key]) {

							that.set(_shortcuts[key], process.argv[i+1]);
							++i;

						}

					}

				}

			}

		}

	}

	function _load(that) {

		return new Promise(function(resolve, reject) {

			try {

				that.clearData();

				that.fileExists().then(function(exists) {

					if (!exists) {
						_loadFromConsole(that);
						resolve({});
					}
					else {

						fs.readFile(_filePath, "utf8", function(err, data) {

							if (err) {
								reject("Impossible to read the configuration file : " + ((err.message) ? err.message : err) + ".");
							}
							else {

								try {

									data = JSON.parse(data);

									that.clearData();
									for (let key in data) { that.set(key, data[key]); }

									_loadFromConsole(that);
									resolve();

								}
								catch (e) {
									reject("Impossible to parse the configuration file's data : " + ((e.message) ? e.message : e) + ".");
								}

							}

						});
						
					}

				});

			}
			catch(e) {
				reject((e.message) ? e.message : e);
			}
		
		});

	}

// module

module.exports = class SimpleConfig extends require("node-containerpattern") {

	constructor (filePath, spaces, commandlineSeparator) {

		if ("undefined" !== typeof filePath && "string" !== typeof filePath) {
			throw new Error("SimpleConfig/constructor : the filePath is not a string");
		}
		else if ("undefined" !== typeof spaces && "boolean" !== typeof spaces) {
			throw new Error("SimpleConfig/constructor : the spaces is not a boolean");
		}
		else if ("undefined" !== typeof commandlineSeparator && "string" !== typeof commandlineSeparator) {
			throw new Error("SimpleConfig/constructor : the commandlineSeparator is not a string");
		}
		else {

			super(commandlineSeparator);

			_filePath = ("string" === typeof filePath && "" != filePath.trim()) ? filePath.trim() : _filePath;
			_spaces = ("boolean" === typeof spaces) ? spaces : _spaces;
			_shortcuts = [];

		}
		
	}

	bindShortcut(key, shortkey) {

		if ("string" !== typeof key) {
			throw new Error("SimpleConfig/bindShortcut : the key is not a string");
		}
		else if ("string" !== typeof shortkey) {
			throw new Error("SimpleConfig/bindShortcut : the shortkey is not a string");
		}
		else {

			key = key.trim().toLowerCase();
			shortkey = shortkey.trim().toLowerCase();

			if ("" === key) {
				throw new Error("SimpleConfig/bindShortcut : empty key");
			}
			else if ("" === shortkey) {
				throw new Error("SimpleConfig/bindShortcut : empty shortkey");
			}
			else {
				_shortcuts[shortkey] = key;
			}

		}

		return this;

	}

	clearShortcuts() {
		_shortcuts = [];
		return this;
	}

	clear() {
		super.clear();
		return this.clearShortcuts();
	}

	deleteFile () {

		let that = this;
		return new Promise(function(resolve, reject) {

			that.fileExists().then(function(exists) {

				if (!exists) {
					resolve();
				}
				else {

					fs.unlink(_filePath, function(err) {

						if (err) {
							reject((err.message) ? err.message : err);
						}
						else {
							resolve();
						}
						
					});
					
				}

			});

		});

	}

	fileExists () {

		let that = this;
		return new Promise(function(resolve) {

			fs.stat(_filePath, function(err, stats) {
				resolve(!err && stats && stats.isFile());
			});

		});

	}

	load () {

		let that = this;
		return new Promise(function(resolve, reject) {

			try {

				if (_savingPromise) {

					_savingPromise.then(function() {
						return _load(that);
					}).then(resolve).catch(function(err) {
						reject("SimpleConfig/load : " + err);
					});

				}
				else {

					_load(that).then(resolve)
					.catch(function(err) {
						reject("SimpleConfig/load : " + err);
					});

				}

			}
			catch (e) {
				reject("SimpleConfig/load : Impossible to load the configuration file's data : " + ((e.message) ? e.message : e) + ".");
			}

		});

	}

	save () {

		let that = this;
		_savingPromise = new Promise(function(resolve, reject) {

			try {

				let dirname = path.dirname(_filePath);

				_mkdirp(dirname, function(err) {

					if (err) {
						_savingPromise = null;
						reject("SimpleConfig/save : Impossible to save the configuration file : " + ((err.message) ? err.message : err) + ".");
					}
					else {

						let objects = {};
						that.forEach(function(value, key) { objects[key] = value; });

						fs.writeFile(_filePath, JSON.stringify(objects, null, (_spaces) ? "  " : ""), "utf8", function(err) {

							_savingPromise = null;

							if (err) {
								reject("SimpleConfig/save : Impossible to save the configuration file's data : " + ((err.message) ? err.message : err) + ".");
							}
							else {
								resolve();
							}

						});
						
					}

				});

			}
			catch (e) {
				reject("SimpleConfig/save : Impossible to save the configuration file's data : " + ((e.message) ? e.message : e) + ".");
				_savingPromise = null;
			}

		});

		return _savingPromise;

	}

	get (key) {
		return _clone(super.get(key));
	}

};
