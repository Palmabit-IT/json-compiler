var _ = require('lodash'),
    JSONfn = require('json-fn'),
    Iterator = require('./src/iterator'),
    DataCompiler = require('./src/data');


exports.compile = function (template, data, helpers) {
  var obj = (typeof template === 'string') ? JSONfn.parse(template) : template;

  //Clean data
  const dataCopy = _.cloneDeep(data)

  //Pre-compile data
  var dataWithHelpers = DataCompiler.preCompile(_.assign({}, dataCopy, helpers));

  //Iterate object and compile
  return Iterator.iterateObj(obj, dataWithHelpers);
};