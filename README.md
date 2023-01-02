# deUMDify

[![Version npm](http://img.shields.io/npm/v/deumdify.svg?style=flat-square)](https://www.npmjs.com/package/deumdify)[![CI](https://img.shields.io/github/actions/workflow/status/primus/deumdify/ci.yml?branch=master&label=CI&style=flat-square)](https://github.com/primus/deumdify/actions?query=workflow%3ACI+branch%3Amaster)[![Coverage Status](http://img.shields.io/coveralls/primus/deumdify/master.svg?style=flat-square)](https://coveralls.io/r/primus/deumdify?branch=master)

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
