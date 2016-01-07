/**
 * RegexUtils class
 *
 * @param regex
 * @param template_open
 * @constructor
 */

var RegexUtils = function (regex, template_open) {
  this.regex = regex;
  this.template_open = template_open;
}

RegexUtils.prototype.regexTest = function (str) {
  this.regex.lastIndex = 0;
  // optimization to avoid regex calls (indexOf is strictly faster)
  return typeof str === 'string' && str.indexOf(this.template_open) >= 0 && this.regex.test(str);
};

RegexUtils.prototype.replace = function (str, cb) {
  return str.replace(this.regex, function (whole, path) {
    return cb(path);
  });
};

module.exports = RegexUtils;