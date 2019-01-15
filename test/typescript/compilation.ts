/// <reference path="../../lib/index.d.ts" />

import ConfManager = require("../../lib/main.js");
import { join } from "path";

const Conf = new ConfManager(join(__dirname, "conf.json"));

Conf
  .skeleton("debug", "boolean").shortcut("debug", "d")
  .shortcut("usr.login", "ul")
  .shortcut("usr.password", "up");

Conf.fileExists().then((exists: boolean) => {

  return Conf.set("usr", { login : "login", pwd : "pwd" })
      .set("debug", false)
      .set("prod", "n") // = false
      .save();

}).then(() => {

  return Conf.load();

}).then(() => {

    console.log(Conf.get("debug"));
    console.log(Conf.get("usr.login"));

}).catch((err: Error) => {
  console.log(err);
});