# deUMDify

[![Version npm](http://img.shields.io/npm/v/deumdify.svg?style=flat-square)](http://browsenpm.org/package/deumdify)[![Build Status](http://img.shields.io/travis/primus/deumdify/master.svg?style=flat-square)](https://travis-ci.org/primus/deumdify)[![Dependencies](https://img.shields.io/david/primus/deumdify.svg?style=flat-square)](https://david-dm.org/primus/deumdify)[![Coverage Status](http://img.shields.io/coveralls/primus/deumdify/master.svg?style=flat-square)](https://coveralls.io/r/primus/deumdify?branch=master)[![IRC channel](http://img.shields.io/badge/IRC-irc.freenode.net%23primus-00a8ff.svg?style=flat-square)](http://webchat.freenode.net/?channels=primus)

This module is a [Browserify](http://browserify.org/) plugin that will expose a
standalone bundle as a property of the global object omitting AMD and CommonJS
support. The reason for this plugin is that Browserify does not give the ability
to generate a standalone bundle without a UMD wrapper.

## Install

```
npm install --save deumdify
```

## Usage

### Command Line

```sh
browserify main.js -s Foo -p deumdify > bundle.js
```

### API

Register the [plugin](https://github.com/substack/node-browserify#bpluginplugin-opts).

```js
'use strict';

var browserify = require('browserify')
  , deumdify = require('deumdify')
  , fs = require('fs');

var b = browserify({ entries: [ 'main.js' ], standalone: 'Foo' });
b.plugin(deumdify);

b.bundle().pipe(fs.createWriteStream('bundle.js'));
```

And that's it.

## License

[MIT](LICENSE)
