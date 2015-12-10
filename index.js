var object = require('json-templater/object'),
    Compiler = require('./array');

exports.compile = function (template, data) {
  //Compile template with json-templater library
  var rendered = object(template, data);
  //Replace arrays
  return Compiler.compile(rendered, data);
};