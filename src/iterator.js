var JSONfn = require('json-fn'),
    object = require('json-templater/object'),
    Compiler = require('./compiler'),
    HelperCompiler = require('./helper_compiler');

var data, compiler, helperCompiler;

function compileFunctionContent(func, parent) {
  var compiled,
      content = func();

  if (typeof content === 'object') {
    compiled = iterateObj(object(content, data), parent);
  }

  return eval('(function () {return ' + JSONfn.stringify(compiled) + '})');
}

function iterateObj (obj, parent) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      switch (typeof obj[i]) {
        case 'string':
          HelperCompiler.compile(compiler.compileValue(obj, i), i, data);
          break;
        case 'object':
          iterateObj(obj[i], obj);
          compiler.compileByKey(obj, i, parent);
          break;
        case 'function':
          obj[i] = compileFunctionContent(obj[i], obj);
          break;
      }
    }
  }

  return obj;
}

exports.iterateObj = function (obj, dataWithHelpers) {
  data = dataWithHelpers;
  compiler = new Compiler(data);
  return iterateObj(obj)
};