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

### Inheritance

[check the official 'node-containerpattern' object documentation](https://github.com/Psychopoulet/node-containerpattern)

### Content

[check the TypeScript definition file](https://github.com/Psychopoulet/node-confmanager/blob/master/lib/index.d.ts)

## Examples

[check the TypeScript compilation tests](https://github.com/Psychopoulet/node-confmanager/blob/master/test/typescript/compilation.ts)

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
