/// <reference path="../../lib/index.d.ts" />

"use strict";

// deps

	// natives
	import { join } from "path";

	// locals
	import ConfManager = require("../../lib/main.js");

// consts

	const Conf: ConfManager = new ConfManager(join(__dirname, "conf.json"));

// module

Conf
	.skeleton("debug", "boolean").shortcut("debug", "d")
	.shortcut("usr.login", "ul")
	.shortcut("usr.password", "up");

Conf.fileExists().then((exists: boolean): Promise<void> => {

	console.log(exists);

	return Conf.set("usr", { login : "login", pwd : "pwd" })
			.set("debug", false)
			.set("prod", "n") // = false
			.save();

}).then((): Promise<void> => {

	return Conf.load();

}).then((): void => {

	console.log(Conf.get("debug"));
	console.log(Conf.get("usr.login"));

}).catch((err: Error): void => {
	console.log(err);
});
