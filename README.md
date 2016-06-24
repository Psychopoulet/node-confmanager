# node-confmanager
A configuration manager


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

* ``` constructor([ string confPath = "node-confmanager/conf/conf.json" [, boolean spaces = false [, string recursionSeparator = "."] ] ] ) ``` spaces: add/remove spaces in the saved file

* ``` string filePath ``` declared file for documentation saving/loading
* ``` boolean spaces ``` add spaces to saved file
* ``` array shortcuts ``` shortcuts for commandline call

* ``` bindShortcut(string key, string shortkey) : return this ``` bind a shortcut for commandline
* ``` deleteFile() : return Promise instance ``` delete the conf file
* ``` fileExists() : return Promise instance => then(function(exists)) ``` check if the conf file exists
* ``` clearShortcuts() : return this ``` forget all the shortcuts
* ``` clear() : return this ``` node-containerpattern.clear & clearShortcuts
* ``` load() : return Promise instance ``` load data from conf file then commandline (commandline takeover)
* ``` save() : return Promise instance ``` save data into conf file

## Examples

```js
const confmanager = require('node-confmanager');

var Conf = new confmanager(require('path').join(__dirname, 'conf.json'));

Conf
  .bindSkeleton("debug", "boolean") // add skeleton (based on [node-containerpattern](https://www.npmjs.com/package/node-containerpattern)) to check datatype
  .bindShortcut('debug', 'd') // add shortcut to simply use comandline params, can add "-d true" to commandline to activate debug
  .bindShortcut('usr.login', 'ul')
  .bindShortcut('usr.password', 'up');

Conf.fileExists().then(function(exists) {
  
  if (exists) {
    return Promise.resolve();
  }
  else {

    // default config sample
    return Conf .set('usr', { login : 'login', pwd : 'pwd' })
                .set('debug', false)
                .set('prod', 'n') // = false
                .save();

  }

}).then(function() {

  // can add "--usr.login login2" or "-ul login2" to commandline to force login change
  return Conf.load();

}).then(function(conf) {

    console.log(conf);
    console.log(Conf.get('debug'));
    console.log(Conf.get('usr.login'));

}).catch(function(err) { console.log(err); });
```

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
