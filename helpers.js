var RegexUtils = require('./utils/regex');

var REGEX = new RegExp(/\[\[#([^\]\]]+)?/g);
var FUNC_OPEN = '[[#';

var regexUtils = new RegexUtils(REGEX, FUNC_OPEN);


function getFunc(view) {
  var func;

  if (regexUtils.regexTest(view)) {
    regexUtils.replace(view, function (path) {
      func = path;
    });
  }

  return func;
}

function compileHelper(str, data) {
  var match,
      func = getFunc(str),
      F = typeof data[func] === 'function' ? data[func] : function () {},
      re = /\[\[#([a-zA-Z.-_0-9]+)\]\]?(.*)\[\[\/([a-zA-Z.-_0-9]+)\]\]?/g;

  while (match = re.exec(str)) {
    if (match.length >= 2) {
      str = str.replace(re, F.apply(this, match[2].trim().split(',')));
    }
  }

  return str;
}

function iterateObj(obj, data) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      switch (typeof obj[i]) {
        case 'object':
          iterateObj(obj[i], data);
          break;
        case 'string':
          obj[i] = compileHelper(obj[i], data);
          break;
      }
    }
  }

  return obj;
}

exports.compile = function (view, data) {
  return iterateObj(view, data);
};