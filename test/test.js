describe('deumdify', function () {
  'use strict';

  var browserify = require('browserify')
    , concat = require('concat-stream')
    , assert = require('assert')
    , jsdom = require('jsdom')
    , deumdify = require('..')
    , path = require('path')
    , fs = require('fs')
    , b;

  var html = fs.readFileSync(path.join(__dirname, 'fixture/index.html'), 'utf8');

  var options = {
    entries: [ path.resolve(__dirname, 'input/main.js') ],
    detectGlobals: false,
    standalone: 'foo'
  };

  beforeEach(function () {
    b = browserify(options).plugin(deumdify);
  });

  it('is a Browserify plugin', function () {
    assert.strictEqual(typeof deumdify, 'function');
  });

  it('bails out if there is no UMD wrapper', function () {
    assert.ok(b.pipeline.get('prune-umd'));
    options.standalone = '';
    b = browserify(options).plugin(deumdify);
    assert.ok(!b.pipeline.get('prune-umd'));
    options.standalone = 'foo';
  });

  it('readds the transform stream when the `reset` event is fired', function (done) {
    assert.ok(b.pipeline.get('prune-umd'));
    b.once('reset', function () {
      assert.ok(b.pipeline.get('prune-umd'));
      done();
    });
    b.reset();
  });

  it('works', function (done) {
    b.bundle().pipe(concat({ encoding: 'string' }, function (output) {
      jsdom.env({
        html: html.replace(/<script[\s\S]+\/script>/, ''),
        src: [ output, 'window.foo();' ],
        done: function (err, window) {
          assert.ifError(err);
          assert.strictEqual(typeof window.foo, 'function');
          assert.strictEqual(window.bar, 'baz qux; typeof process is: undefined');
          done();
        }
      });
    }));
  });

  it('removes AMD support', function (done) {
    var ws = fs.createWriteStream(path.join(__dirname, 'fixture/bundle.js'))
      , bundle = b.bundle();

    bundle.on('data', ws.write.bind(ws));
    bundle.on('end', function () {
      var window = jsdom.jsdom(html).parentWindow;

      window.onModuleLoaded = function () {
        try {
          assert.strictEqual(typeof window.foo, 'function');
          window.foo();
          assert.strictEqual(window.bar, 'baz qux; typeof process is: undefined');
        } catch (e) {
          return done(e);
        }

        done();
      };
    });
  });

  it('removes CommonJS support', function () {
    assert.throws(function () {
      require('./fixture/bundle');
    });
  });
});
