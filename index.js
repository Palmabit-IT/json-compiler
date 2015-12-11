var _ = require('lodash'),
    object = require('json-templater/object'),
    Compiler = require('./array'),
    DataCompiler = require('./utils/data'),
    Helpers = require('./helpers');

exports.compile = function (template, data, helpers) {
  //Pre-compile data
  var dataWithHelpers = DataCompiler.preCompile(_.assign({}, data, helpers));

  //Compile template with json-templater library
  var rendered = object(template, dataWithHelpers);

  //Replace arrays
  var rendered = Compiler.compile(rendered, dataWithHelpers);

  //Post-compiling helpers applying
  return Helpers.compile(rendered, dataWithHelpers);
};