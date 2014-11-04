# deUMDify

[![Build Status](https://travis-ci.org/primus/deumdify.svg?branch=master)](https://travis-ci.org/primus/deumdify)
[![NPM version](https://badge.fury.io/js/deumdify.svg)](http://badge.fury.io/js/deumdify)
[![Coverage Status](https://img.shields.io/coveralls/primus/deumdify.svg)](https://coveralls.io/r/primus/deumdify?branch=master)

This module is a [Browserify](http://browserify.org/) plugin that will expose a
standalone bundle as a property of the global object omitting AMD and CommonJS
support.
The reason for this plugin is that Browserify does not give the ability to
generate a standalone bundle without an UMD wrapper.

## Install

```
npm install --save deumdify
```

## Usage

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

MIT
