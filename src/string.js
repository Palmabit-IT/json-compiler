var _ = require('lodash'),
    Extract = require('./utils/extract'),
    RegexUtils = require('./utils/regex');

var REGEX = new RegExp(/{{(?!#)(?!\/)([a-zA-Z.-_0-9]+)}}/g);
var TEMPLATE_OPEN = '{{';

var regexUtils = new RegexUtils(REGEX, TEMPLATE_OPEN);


exports.compile = function (str, data) {
  if (!regexUtils.regexTest(str)) {
    return str;
  }

  return regexUtils.replace(str, function (path) {
    var val = Extract.extractValue(path, data);
    return (typeof val === 'function') ? val() : val;
  });
};
