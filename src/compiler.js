var _ = require('lodash'),
    Extract = require('./utils/extract'),
    RegexUtils = require('./utils/regex');

var REGEX = new RegExp(/{{([a-zA-Z.-_0-9]+)}}/);
var TEMPLATE_OPEN = '{{';
var EXCLUDE_OPEN = '{{#';

var templateData = {};


function replaceArray(path, obj) {
  var array = [],
      data = Extract.extractValue(path, templateData) || [];

  for (var i = 0; i < data.length; i += 1) {
    array.push(getArrayElement(data[i], obj));
  }

  return array;
}

function getArrayElement(data, obj) {
  var o, temp, item = [];

  if (!obj) {
    return data;
  }

  for (var j = 0; j < obj.length; j += 1) {
    o = obj[j];

    switch (typeof o) {
      case 'string':
        item.push(data[o] || '');
        break;
      case 'object':
        temp = {};
        temp[o.fieldKey || 'text'] = Extract.extractValue(o.fieldValue || 'text', data);
        _.assign(temp, o);
        delete temp['fieldKey'];
        delete temp['fieldValue'];
        item.push(temp);
        break;
    }
  }

  return item;
}


function Compiler (data) {
  this.regexUtils = new RegexUtils(REGEX, TEMPLATE_OPEN, EXCLUDE_OPEN);
  templateData = data;
}

Compiler.prototype.compileByKey = function (obj, key, parent) {
  if (Array.isArray(parent)) {
    parent.push(this.compileKey(obj, key));
    parent.splice(key, 1);
  }

  return obj;
};

Compiler.prototype.compileKey = function (obj, key) {
  var temp = {},
      value = obj[key];

  if (!this.regexUtils.regexTest(key)) {
    return obj;
  }

  this.regexUtils.replace(key, function (path) {
    temp = replaceArray(path, value);
  });

  return temp;
};

Compiler.prototype.compileValue = function (obj, key) {
  var value = obj[key];

  if (!this.regexUtils.regexTest(value)) {
    return obj;
  }

  this.regexUtils.replace(value, function (path) {
    var val = Extract.extractValue(path, templateData) || [];

    if (typeof val === 'function') {
      val = value.replace(REGEX, val());
    }

    if (Array.isArray(obj)) {
      obj.push(val);
      obj.splice(key, 1);
    } else {
      obj[key] = val;
    }
  });

  return obj;
};

module.exports = Compiler;