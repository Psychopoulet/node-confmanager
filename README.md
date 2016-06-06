# node-confmanager
A configuration manager


## Installation

```bash
$ npm install node-confmanager
```

## Features

  * All the features of the node-containerpattern package
  * clone data in "get" action to avoid unwanted changes
  * Saving the data in a JSON file
  * Load the data from this JSON file and/or commandline
  * access to the data with shortcuts in commandline

## Doc

### node-containerpattern

* ``` constructor([ string recursionSeparator = "." ]) ``` recursionSeparator: used to parse recursive keys
* ``` int size ``` keys counter
* ``` bindSkeleton(string key, string skeleton) : return this ``` skeleton must be "string", "object", "array", "boolean", "integer", "float" or "number"
* ``` clearData() : return this ``` forget all the keys and there values (=> Map.clear)
* ``` clearSkeleton() : return this ``` forget all the skeletons
* ``` clear() : return this ``` clearData & clearSkeleton
* ``` get(string key) : return mixed ``` return the value in association with this key (may be recursive)
* ``` has(string key) : return bool ``` check if a key is used (may be recursive)
* ``` set(string key, mixed value) : return this ``` associate and remember a key with a value (may be recursive)
* ``` delete(string key) : return this ``` forget a key and its value

### node-confmanager

* ``` constructor([ string confPath = "node-confmanager/conf/conf.json" [, boolean spaces = false [, string recursionSeparator = "."] ] ] ) ``` spaces: add/remove spaces in the saved file
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
  .bindSkeleton("debug", "boolean") // add skeleton (based on node-containerpattern) to check datatype
  .bindShortcut('debug', 'd') // add shortcut to simply use comandline params, can add "-d true" to commandline to activate debug
  .bindShortcut('usr.login', 'ul')
  .bindShortcut('usr.password', 'up');

Conf.fileExists().then(function(exists) {
  
  if (!exists) {
    // default config sample
    Conf.set('usr', { login : 'login', pwd : 'pwd' })
      .set('debug', false)
      .set('prod', 'n') // = false
      .save().catch(function(err) { console.log(err); });
  }

  // can add "--usr.login login2" or "-ul login2" to commandline to force login change

  // automaticaly wait for eventual saving
  Conf.load().then(function(conf) {
    console.log(conf);
    console.log(Conf.get('debug'));
    console.log(Conf.get('usr.login'));
  })
  .catch(function(e) { console.log(e); });

})

```

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
