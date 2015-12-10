/**
 * RegexUtils class
 *
 * @param regex
 * @param template_open
 * @constructor
 */

var RegexUtils = function (regex, template_open, exclude) {
  this.regex = regex;
  this.template_open = template_open;
  this.exclude = exclude;
}

RegexUtils.prototype.regexTest = function (str) {
  // optimization to avoid regex calls (indexOf is strictly faster)
  return typeof str === 'string' && str.indexOf(this.template_open) >= 0 && str.indexOf(this.exclude) < 0 && this.regex.test(str);
};

RegexUtils.prototype.replace = function (str, cb) {
  return str.replace(this.regex, function (whole, path) {
    return cb(path);
  });
};

module.exports = RegexUtils;