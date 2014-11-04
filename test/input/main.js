'use strict';

module.exports = function () {
  window.bar = require('./helper') +'; typeof process is: '+ typeof process;
};
