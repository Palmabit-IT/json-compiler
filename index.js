var _ = require('lodash'),
    object = require('json-templater/object'),
    Iterator = require('./src/iterator'),
    DataCompiler = require('./src/data_compiler');


exports.compile = function (template, data, helpers) {
  //Pre-compile data
  var dataWithHelpers = DataCompiler.preCompile(_.assign({}, data, helpers));

  //Pre-Compile template with json-templater library
  //Iterate object and compile
  return Iterator.iterateObj(object(template, dataWithHelpers), dataWithHelpers);
};