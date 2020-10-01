# node-confmanager
A configuration manager

[![Build status](https://api.travis-ci.org/Psychopoulet/node-confmanager.svg?branch=master)](https://travis-ci.org/Psychopoulet/node-confmanager)
[![Coverage status](https://coveralls.io/repos/github/Psychopoulet/node-confmanager/badge.svg?branch=master)](https://coveralls.io/github/Psychopoulet/node-confmanager)
[![Dependency status](https://david-dm.org/Psychopoulet/node-confmanager/status.svg)](https://david-dm.org/Psychopoulet/node-confmanager)
[![Dev dependency status](https://david-dm.org/Psychopoulet/node-confmanager/dev-status.svg)](https://david-dm.org/Psychopoulet/node-confmanager?type=dev)
[![Issues](https://img.shields.io/github/issues/Psychopoulet/node-confmanager.svg)](https://github.com/Psychopoulet/node-confmanager/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/Psychopoulet/node-confmanager.svg)](https://github.com/Psychopoulet/node-confmanager/pulls)

## Installation

```bash
$ npm install node-confmanager
```

## Features

  * All the features of the [node-containerpattern](https://www.npmjs.com/package/node-containerpattern) package
  * clone data in "get" action to avoid unwanted changes
  * Saving the data in a JSON file
  * Load the data from this JSON file and/or commandline
  * access to the data with shortcuts in commandline

## Doc

see the [node-containerpattern](https://www.npmjs.com/package/node-containerpattern) documentation to see extended methods & attribues

### node-confmanager

  -- Attributes --

  * ``` filePath: string ``` conf file
  * ``` spaces: string ``` formate file
  * ``` shortcuts: string ``` for container

  -- Constructor --

  * ``` constructor(confPath?: string, spaces?: boolean, recursionSeparator?: string) ```

  -- Methods --

  * ``` deleteFile() : return Promise instance ``` delete the conf file
  * ``` fileExists() : return Promise instance => then((exists) => {}) ``` check if the conf file exists
  * ``` clearShortcuts() : return this ``` forget all the shortcuts
  * ``` clear() : return this ``` node-containerpattern.clear & clearShortcuts
  * ``` load() : return Promise instance ``` load data from conf file then commandline (commandline takeover)
  * ``` save() : return Promise instance ``` save data into conf file
  * ``` shortcut(string key, string shortkey) : return this ``` bind a shortcut for commandline

## Examples

### Native

```javascript
const ConfManager = require("node-confmanager");

const conf = new ConfManager(require("path").join(__dirname, "conf.json"));

conf
  .skeleton("debug", "boolean") // add skeleton (based on [node-containerpattern](https://www.npmjs.com/package/node-containerpattern)) to check datatype
  .shortcut("debug", "d") // add shortcut to simply use comandline params, can add "-d true" to commandline to activate debug
  .shortcut("usr.login", "ul")
  .shortcut("usr.password", "up");

conf.fileExists().then((exists) => {
  
  return exists ? Promise.resolve() : Conf.set("usr", { login : "login", pwd : "pwd" })
      .set("debug", false)
      .set("prod", "n") // = false
      .save();

}).then(() => {

  // can add "--usr.login login2" or "-ul login2" to commandline to force login change
  return conf.load();

}).then(() => {

    console.log(conf.get("debug"));
    console.log(conf.get("usr.login"));

}).catch((err) => {
  console.log(err);
});
```

### Typescript

```typescript
import ConfManager = require("node-confmanager");
import { join } from "path";

const Conf = new ConfManager(join(__dirname, "conf.json"));

Conf
  .skeleton("debug", "boolean").shortcut("debug", "d")
  .shortcut("usr.login", "ul")
  .shortcut("usr.password", "up");

Conf.fileExists().then((exists: boolean) => {

  return exists ? Promise.resolve() : Conf.set("usr", { login : "login", pwd : "pwd" })
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
```

### Run

```bash
node mysoft.js -d
node mysoft.js --debug
node mysoft.js --debug "true"
node mysoft.js --debug "yes"
node mysoft.js --debug "y"
```

## Tests

```bash
$ npm run-script tests
```

## License

  [ISC](LICENSE)
