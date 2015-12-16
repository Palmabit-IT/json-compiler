var _ = require('lodash'),
    Extract = require('./utils/extract'),
    RegexUtils = require('./utils/regex');

var REGEX = new RegExp(/\[\[([a-zA-Z.-_0-9]+)\]\]/g);
var TEMPLATE_OPEN = '[[';

var regexUtils = new RegexUtils(REGEX, TEMPLATE_OPEN);


function replaceArray(data, path, obj) {
  var array = [],
      objData = Extract.extractValue(path, data) || [];

  for (var i in objData) {
    array.push(getArrayElement(objData[i], obj));
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

function compileString(str, data) {
  var temp = {};

  if (!regexUtils.regexTest(str)) {
    return str;
  }

  regexUtils.replace(str, function (path) {
    temp = replaceArray(data, path);
  });

  return temp;
}

function compileObject(obj, data) {
  var temp = {},
      keys = _.keys(obj);

  if (keys.length === 0) {
    return obj;
  }

  var key = keys[0],
      value = obj[key];

  if (!regexUtils.regexTest(key)) {
    return obj;
  }

  regexUtils.replace(key, function (path) {
    temp = replaceArray(data, path, value);
  });

  return temp;
}

function compile(obj, data) {
  switch (typeof obj) {
    case 'string':
      return compileString(obj, data);
    case 'object':
      return compileObject(obj, data);
    default:
      return obj;
  }
};

function compileArray(array, data) {
  var result = [];

  _.forEachRight(array, function (obj, i) {
    var canReplace = !Array.isArray(obj),
        compiled = compile(obj, data);

    if (canReplace && Array.isArray(compiled)) {
      _.forEachRight(compiled, function (c) {
        result.unshift(c);
      });
    } else {
      result.unshift(compiled);
    }
  });

  return result;
}

module.exports = {
  compile: compile,
  compileArray: compileArray
}