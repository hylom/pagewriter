// page.js

var querystring = require('querystring');

function Page () {
};

Page.prototype.unescapedPath = function () {
  if (this.targetFile.relativePath !== undefined) {
    return querystring.unescape(this.targetFile.relativePath);
  } else {
    return undefined;
  }
};

var page = {};

page.createPage = function () {
  var self = new Page;
  self.toolbar = [];
  self.title = 'pagewriter';
  self.targetFile = {};
  return self;
};

module.exports = page;
