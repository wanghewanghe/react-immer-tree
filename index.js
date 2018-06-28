/*!
  Copyright (c) 2018 Wang He.
  Licensed under the MIT License (MIT), see
  http://wanghewanghe.github.io/react-immer-tree
*/
/* global define */

(function () {
  'use strict';
  var Tree = require('./build/Tree')

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tree;
  } else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define('ReactImmerTree', [], function () {
      return Tree;
    });
  }
}());
