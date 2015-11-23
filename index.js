'use strict';

var estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , through = require('through2')
  , esprima = require('esprima');

//
// Expose the plugin.
//
module.exports = deumdify;

/**
 * Prune unwanted branches from the given source code.
 *
 * @param {String} code Source code to prune
 * @returns {String} Pruned source code
 * @api private
 */
function prune(code) {
  var ast = esprima.parse(code);

  estraverse.replace(ast, {
    leave: function leave(node, parent) {
      var ret;

      if ('IfStatement' === node.type) {
        if ('BinaryExpression' !== node.test.type) return;

        if ('self' === node.test.left.argument.name) {
          node.alternate = null;
        } else if ('global' === node.test.left.argument.name) {
          ret = node.alternate;
        }

        return ret;
      }

      if (
          'BlockStatement' === node.type
        && 'FunctionExpression' === parent.type
      ) {
        return node.body[0].alternate.alternate;
      }
    }
  });

  return escodegen.generate(ast, {
    format: {
      indent: { style: '  ' },
      semicolons: false,
      compact: true
    }
  });
}

/**
 * Create a transform stream.
 *
 * @returns {Stream} Transform stream
 * @api private
 */
function createStream() {
  var firstChunk = true;

  var stream = through(function transform(chunk, encoding, next) {
    if (!firstChunk) return next(null, chunk);

    firstChunk = false;

    var regex = /^(.+?)(\(function\(\)\{)/
      , pattern;

    chunk = chunk.toString().replace(regex, function replacer(match, p1, p2) {
      pattern = p1;
      return p2;
    });

    this.push(new Buffer(prune(pattern) + chunk));
    next();
  });

  stream.label = 'prune-umd';
  return stream;
}

/**
 * Prune the UMD pattern from a Browserify bundle stream.
 *
 * @param {Browserify} browserify Browserify instance
 * @api public
 */
function deumdify(browserify) {
  //
  // Bail out if there is no UMD wrapper.
  //
  if (!browserify._options.standalone) return;

  browserify.pipeline.push(createStream());
  browserify.on('reset', function reset() {
    browserify.pipeline.push(createStream());
  });
}
