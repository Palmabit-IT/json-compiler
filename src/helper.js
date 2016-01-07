var _ = require('lodash'),
    Extract = require('./utils/extract'),
    RegexUtils = require('./utils/regex');

var REGEX = new RegExp(/{{#([^}}]+)?/g);
var FUNC_OPEN = '{{#';

var regexUtils = new RegexUtils(REGEX, FUNC_OPEN);


function getHelpers(view, data) {
  var helperNames = {};

  if (regexUtils.regexTest(view)) {
    regexUtils.replace(view, function (path) {
      helperNames[path] = Extract.extractValue(path, data);
    });
  }

  return helperNames;
}

function applyHelper(helper, func, str) {
  var match,
      F = func && typeof func === 'function' ? func : function () {},
      re = new RegExp('{{#' + helper + '}}?(.*){{\\/' + helper + '}}?');

  while (match = re.exec(str)) {
    if (match.length >= 1) {
      return str.replace(re, F.apply(this, match[1].trim().split(',')));
    }
  }

  return str;
}

exports.compile = function (str, data) {
  var match,
      helperNames = getHelpers(str, data);

  _.forEach(helperNames, function (func, helper) {
    str = applyHelper(helper, func, str);
  });

  return str;
};