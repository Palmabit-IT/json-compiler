var RegexUtils = require('./utils/regex');

var REGEX = new RegExp(/\[\[#([^\]\]]+)?/g);
var FUNC_OPEN = '[[#';

var regexUtils = new RegexUtils(REGEX, FUNC_OPEN);


function getFunc (view) {
  var func;

  if (regexUtils.regexTest(view)) {
    regexUtils.replace(view, function (path) {
      func = path;
    });
  }

  return func;
}

exports.compile = function (view, data) {
  var match, compiled,
      func = getFunc(view),
      F = typeof data[func] === 'function' ? data[func] : function () {},
      re = /\[\[#([a-zA-Z.-_0-9]+)\]\]?(.*)\[\[\/([a-zA-Z.-_0-9]+)\]\]?/g;

  while(match = re.exec(view)) {
    if (match.length >= 2) {
      compiled = view.replace(re, F.apply(this, match[2].trim().split(',')));
    }
  }

  return JSON.parse(compiled);
};