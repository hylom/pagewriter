// pwutils.js
// utility functions fot pagewriter

var path = require('path');
var fs = require('fs');
var querystring = require('querystring');

var config = require('./config');
var pwutils = {};

pwutils.getConfigValue = function (key, defaultValue) {
  defaultValue = defaultValue || null;
  var value = config[key] || defaultValue;
  return value;
};

pwutils.getPageAttr = function (rpath) {
  var root = pwutils.getConfigValue('rootDir');
  rpath = path.normalize(querystring.unescape(rpath));
  var apath = path.normalize(path.join(root, rpath));
  return {
    pathname: apath,
    type: path.extname(rpath),
    relativePath: rpath};
}

pwutils.escapeFilename = function (filename) {
  var retVal;
  retVal = querystring.escape(filename);
  retVal = retVal.replace('/', '%2F');
  return retVal;
};

pwutils.unescapeFilename = function (filename) {
  var retVal;
  retVal = retVal.replace('%2F', '/');
  retVal = querystring.unescape(filename);
  return retVal;
};

/*
 * validate Relative Path
 */
pwutils.validateRelativePath = function (rpath) {
  var normPath = path.normalize(rpath);
  if (normPath.indexOf('/../') == 0) {
    return false;
  }
  return true;
}

module.exports = pwutils;
