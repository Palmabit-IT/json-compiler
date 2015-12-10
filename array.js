var _ = require('lodash'),
    Extract = require('./extract');
var templateData = {};

var REGEX = new RegExp(/\[\[([a-zA-Z.-_0-9]+)\]\]/);
var TEMPLATE_OPEN = '[[';

function regexTest(property) {
  // optimization to avoid regex calls (indexOf is strictly faster)
  return typeof property === 'string' && property.indexOf(TEMPLATE_OPEN) >= 0 && REGEX.test(property);
}

function replace(property, cb) {
  return property.replace(REGEX, function (whole, path) {
    return cb(path);
  });
}

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

    if (regexTest(property)) {
      replace(property, function (path) {
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
  if (!regexTest(property)) {
    return;
  }

  replace(property, function (path) {
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
  if (!regexTest(value)) {
    return;
  }

  replace(value, function (path) {
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