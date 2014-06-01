
var fs = require('fs');
var path = require('path');

var pwutils = require('./pwutils');

var indexes = {};

/*
 * search index file in given directory
 * callback: function (err, filepath, type)
 */

var indexes = {};

indexes.getIndex = function getIndex(rpath, callback) {
  if (!pwutils.validateRelativePath) {
    return undefined;
  }
  var rootDir = pwutils.getConfigValue('rootDir');
  var indexFiles = pwutils.getConfigValue('indexes');

  apath = path.normalize(path.join(rootDir, rpath));
  for (var i = 0; i < indexFiles.length; i++) {
    console.log(indexFiles[i]);
    var f = path.join(apath, indexFiles[i]);
    if (fs.existsSync(f)) {
      return { pathname: f, type: path.extname(indexFiles[i])};
    }
  }
  return undefined;
};

module.exports = indexes;
