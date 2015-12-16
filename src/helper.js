var Extract = require('./utils/extract'),
    RegexUtils = require('./utils/regex');

var REGEX = new RegExp(/{{#([^}}]+)?/g);
var FUNC_OPEN = '{{#';

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


exports.compile = function (str, data) {
  var match,
      func = getFunc(str),
      F = data && typeof data[func] === 'function' ? data[func] : function () {},
      re = /{{#([a-zA-Z.-_0-9]+)}}?(.*){{\/([a-zA-Z.-_0-9]+)}}?/g;

  while (match = re.exec(str)) {
    if (match.length >= 2) {
      return str.replace(re, F.apply(this, match[2].trim().split(',')));
    }
  }

  return str;
};