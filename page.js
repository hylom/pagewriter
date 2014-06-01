// page.js

function Page () {
};

var page = {};

page.createPage = function () {
  var self = {};
  self.toolbar = [];
  self.title = 'pagewriter';
  self.targetFile = {};
  return self;
};

module.exports = page;
