/// <reference path="../../lib/cjs/main.d.cts" />

"use strict";

// deps

	// natives
	import { join } from "node:path";

	// locals
	import ConfManager = require("../../lib/cjs/main.cjs");

// consts

	const conf: ConfManager = new ConfManager(join(__dirname, "conf.json"));

// module

conf
	.skeleton("debug", "boolean").shortcut("debug", "d")
	.shortcut("usr.login", "ul")
	.shortcut("usr.password", "up");

conf.fileExists().then((exists: boolean): Promise<void> => {

	console.log(exists);

	return conf.set("usr", { login : "login", pwd : "pwd" })
			.set("debug", false)
			.set("prod", "n") // = false
			.save();

}).then((): Promise<void> => {

	return conf.load();

}).then((): Promise<void> => {

	console.log(conf.get("debug"));
	console.log(conf.get("usr.login"));

	conf.clear();
	return conf.deleteFile();

}).catch((err: Error): void => {

	console.error(err);

	process.exitCode = 1;
	process.exit(1);

});
