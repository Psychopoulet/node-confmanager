# node-confmanager
A configuration manager

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_node-confmanager&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_node-confmanager)
[![Issues](https://img.shields.io/github/issues/Psychopoulet/node-confmanager.svg)](https://github.com/Psychopoulet/node-confmanager/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/Psychopoulet/node-confmanager.svg)](https://github.com/Psychopoulet/node-confmanager/pulls)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_node-confmanager&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_node-confmanager)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_node-confmanager&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_node-confmanager)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_node-confmanager&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_node-confmanager)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_node-confmanager&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_node-confmanager)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_node-confmanager&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_node-confmanager)

[![Known Vulnerabilities](https://snyk.io/test/github/Psychopoulet/node-confmanager/badge.svg)](https://snyk.io/test/github/Psychopoulet/node-confmanager)

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
# if "debug" skeleton is setted & defined as a boolean
node mysoft.js -d      # if "debug" shortcut is setted
node mysoft.js --debug
node mysoft.js --debug "true"
node mysoft.js --debug "yes"
node mysoft.js --debug "y"
```

```bash
# if "arr" skeleton is defined as a array
node mysoft.js --arr test1 test2
node mysoft.js --arr "[ \"test1\", \"test2\" ]"
```

## Tests

```bash
$ npm run-script tests
```

## License

  [ISC](LICENSE)
