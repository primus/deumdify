'use strict';

var firstChunk = require('first-chunk-stream')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , esprima = require('esprima');

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
    enter: function enter(node) {
      if ('BlockStatement' === node.type) {
        return node.body[0].alternate.alternate;
      }
      if (
          'ConditionalExpression' === node.type
        && 'global' === node.consequent.right.name
      ) {
        return node.alternate;
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
  var stream = firstChunk(function transform(chunk, encoding, next) {
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
 * @param {Browserify} Browserify instance
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

//
// Expose the function.
//
module.exports = deumdify;
