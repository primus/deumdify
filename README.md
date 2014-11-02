# deUMDify

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
b.plugin(deamdify);

b.bundle().pipe(fs.createWriteStream('bundle.js'));
```

And that's it.

## License

MIT
