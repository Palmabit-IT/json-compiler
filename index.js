var _ = require('lodash'),
    object = require('json-templater/object'),
    Compiler = require('./array');

exports.compile = function (template, data, helpers) {
  var dataWithHelpers = _.assign({}, data, helpers);
  //Compile template with json-templater library
  var rendered = object(template, dataWithHelpers);
  //Replace arrays
  return Compiler.compile(rendered, dataWithHelpers);
};