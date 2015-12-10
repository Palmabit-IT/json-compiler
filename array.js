var _ = require('lodash'),
    Extract = require('./utils/extract'),
    RegexUtils = require('./utils/regex');

var REGEX = new RegExp(/\[\[([a-zA-Z.-_0-9]+)\]\]/);
var TEMPLATE_OPEN = '[[';
var EXCLUDE_OPEN = '[[#';

var templateData = {};
var regexUtils = new RegexUtils(REGEX, TEMPLATE_OPEN, EXCLUDE_OPEN);


function pushToArray(path, array, obj) {
  var data = Extract.extractValue(path, templateData) || [];

  for (var i = 0; i < data.length; i += 1) {
    array.push(getArrayElement(data[i], obj));
  }
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
        temp[o.fieldKey || 'text'] = data[o.fieldValue || 'text'];
        _.assign(temp, o);
        delete temp['fieldKey'];
        delete temp['fieldValue'];
        item.push(temp);
        break;
    }
  }

  return item;
}


function findInObject(obj, parent, index) {
  for (var property in obj) {
    replaceValue(property, obj[property], obj);

    if (regexUtils.regexTest(property)) {
      regexUtils.replace(property, function (path) {
        pushToArray(path, parent, obj[property]);
        parent.splice(index, 1);
      });
    } else if (Array.isArray(obj[property])) {
      findInArray(obj[property]);
    } else if (typeof obj[property] === 'object') {
      findInObject(obj[property], obj);
    }
  }
}

function findInArray(arr) {
  for (var i = 0; i < arr.length; i += 1) {
    if (Array.isArray(arr[i])) {
      findInArray(arr[i]);
    } else if (typeof arr[i] === 'object') {
      findInObject(arr[i], arr, i);
    } else if (typeof arr[i] === 'string') {
      replaceProperty(arr[i], arr, i);
    }
  }
}

function replaceProperty(property, parent, index) {
  if (!regexUtils.regexTest(property)) {
    return;
  }

  regexUtils.replace(property, function (path) {
    var val = Extract.extractValue(path, templateData) || [];

    if (typeof val === 'function') {
      parent[index] = property.replace(REGEX, val());
    } else {
      parent.push(val);
      parent.splice(index, 1);
    }
  });
}

function replaceValue(property, value, obj) {
  if (!regexUtils.regexTest(value)) {
    return;
  }

  regexUtils.replace(value, function (path) {
    var val = Extract.extractValue(path, templateData) || [];

    if (typeof val === 'function') {
      obj[property] = value.replace(REGEX, val());
    } else {
      obj[property] = val;
    }
  });
}

exports.compile = function (obj, data) {
  templateData = data || {};
  findInObject(obj);
  return obj;
};