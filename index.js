var _ = require('lodash'),
    Iterator = require('./src/iterator'),
    DataCompiler = require('./src/data_compiler');


exports.compile = function (template, data, helpers) {
  //Pre-compile data
  var dataWithHelpers = DataCompiler.preCompile(_.assign({}, data, helpers));

  //Iterate object and compile
  return Iterator.iterateObj(template, dataWithHelpers);
};