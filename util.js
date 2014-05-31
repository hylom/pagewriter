// util.js
// utility functions fot pagewriter

var path = require('path');
var config = require('./config');
var util = {};

util.getConfigValue = function (key, defaultValue) {
  defaultValue = defaultValue || null;
  var value = config[key] || defaultValue;
  return value;
};

/*
 * validate Relative Path
 */
util.validateRelativePath = function (rpath) {
  var normPath = path.normalize(rpath);
  if ((rpath.charAt(0) == '/')
      ||  (normPath.indexOf('../') == 0)) {
    return false;
  }
  return true;
}

module.exports = util;
