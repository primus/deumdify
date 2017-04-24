describe('deumdify', function () {
  'use strict';

  var browserify = require('browserify')
    , concat = require('concat-stream')
    , assert = require('assert')
    , jsdom = require('jsdom')
    , deumdify = require('..')
    , path = require('path')
    , fs = require('fs')
    , vm = require('vm')
    , b;

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
      var dom =  new jsdom.JSDOM('', { runScripts: 'outside-only' });

      dom.runVMScript(new vm.Script(output));
      dom.runVMScript(new vm.Script('window.foo();'));

      assert.strictEqual(typeof dom.window.foo, 'function');
      assert.strictEqual(dom.window.bar, 'baz qux; typeof process is: undefined');
      done();
    }));
  });

  it('removes AMD support', function (done) {
    var ws = fs.createWriteStream(path.join(__dirname, 'fixture/bundle.js'))
      , file = path.join(__dirname, 'fixture/index.html');

    ws.on('finish', function () {
      var dom = new jsdom.JSDOM(fs.readFileSync(file, 'utf8'), {
        runScripts: 'dangerously',
        url: 'file://'+ file,
        resources: 'usable'
      });

      dom.window.onModulesLoaded = function () {
        assert.strictEqual(typeof dom.window.foo, 'function');
        dom.window.foo();
        assert.strictEqual(dom.window.bar, 'baz qux; typeof process is: undefined');
        done();
      };
    });

    b.bundle().pipe(ws);
  });

  it('removes CommonJS support', function () {
    assert.throws(function () {
      require('./fixture/bundle');
    });
  });
});
