var fs = require('fs');

var express = require('express');
var router = express.Router();

var page = require('../page');
var indexes = require('../indexes');
var formatter = require('../formatter');
var pwutils = require('../pwutils');

function showPage(req, res, newPage) {
  fs.readFile(newPage.targetFile.pathname, {encoding: 'utf8'}, _showFile);
  function _showFile (err, data) {
    if (err) {
      return res.send(500);
    }
    data = formatter.format(data, newPage.targetFile.type);

    newPage.toolbar = [
      {href: newPage.editUrl, title: 'edits'}
    ];
    res.render('index', {
      title: 'Express',
      contents: data,
      page: newPage
    });
  }
}

function editPage(req, res, newPage) {
  fs.readFile(newPage.targetFile.pathname, {encoding: 'utf8'}, _showFile);
  function _showFile (err, data) {
    if (err) {
      return res.send(500);
    }
    newPage.toolbar = [
      {title: 'save', href: '#', id: 'toolbar-save'}
    ];
    res.render('editor', {
      contents: data,
      page: newPage
    });
  }
}

/* GET home page. */
router.get('/', function (req, res) {
  console.log("?????");
  var indexFile = indexes.getIndex('');
  if (indexFile === undefined) {
    return res.send(500);
  }

  var newPage = page.createPage();
  newPage.title = 'pagewriter';
  newPage.path = '/' + indexFile.relativePath;
  newPage.editUrl = '/' + indexFile.relativePath + '?mode=edit';
  newPage.targetFile = indexFile;
  showPage(req, res, newPage);
});

/* GET page */
router.get('/:target', function (req, res) {
  // validate path
  console.log("!!!!");
  var target = req.params.target;
  if (!pwutils.validateRelativePath(target)) {
    return res.send(403);
  }

  // get target file
  var targetFile = pwutils.getPageAttr(target);
  if (targetFile === undefined) {
    return res.send(404);
  }

  var newPage = page.createPage();
  newPage.targetFile = targetFile;
  newPage.editUrl = req.path + '?mode=edit';
  newPage.path = '/' + target;
  newPage.title = newPage.path + ' - pagewriter';

  if (req.query.mode == 'edit') {
    return editPage(req, res, newPage);
  }
  showPage(req, res, newPage);
});


module.exports = router;
