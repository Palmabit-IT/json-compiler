var _ = require('lodash'),
    JSONfn = require('json-fn'),
    ArrayCompiler = require('./array'),
    Helper = require('./helper'),
    String = require('./string');

var data, compiler, helperCompiler;

/*
function compileFunctionContent(func) {
  var compiled,
      content = func();

  if (typeof content === 'object') {
    compiled = iterateObj(content);
  }

  return eval('(function () {return ' + JSONfn.stringify(compiled) + '})');
}
*/

function iterateArray(array) {
  return ArrayCompiler.compileArray(array.map(function(obj) {
    return iterate(obj);
  }), data);
}

function iterateObj(obj) {
  var result = {};

  if (Array.isArray(obj)) {
    return iterateArray(obj);
  }

  for (var key in obj) {
    result[iterate(key)] = iterate(obj[key]);
  }

  return result;
}

function iterate(input) {
  switch (typeof input) {
    case 'string':
      return Helper.compile(String.compile(input, data), data);
    case 'object':
      return input ? iterateObj(input) : input;
    default:
      return input;
  }
}


exports.iterateObj = function (obj, dataWithHelpers) {
  data = dataWithHelpers;
  return iterate(obj)
};