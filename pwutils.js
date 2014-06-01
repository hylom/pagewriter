// pwutils.js
// utility functions fot pagewriter

var path = require('path');
var fs = require('fs');

var config = require('./config');
var pwutils = {};

pwutils.getConfigValue = function (key, defaultValue) {
  defaultValue = defaultValue || null;
  var value = config[key] || defaultValue;
  return value;
};

pwutils.getPageAttr = function (rpath) {
  var root = pwutils.getConfigValue('rootDir');
  var apath = path.normalize(path.join(root, rpath));
  if (fs.existsSync(apath)) {
    return {
      pathname: apath,
      type: path.extname(rpath),
      relativePath: rpath};
  }
  return undefined;
}

/*
 * validate Relative Path
 */
pwutils.validateRelativePath = function (rpath) {
  var normPath = path.normalize(rpath);
  if ((rpath.charAt(0) == '/')
      ||  (normPath.indexOf('../') == 0)) {
    return false;
  }
  return true;
}

module.exports = pwutils;
