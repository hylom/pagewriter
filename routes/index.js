var fs = require('fs');

var express = require('express');
var router = express.Router();

var indexes = require('../indexes');
var formatter = require('../formatter/plaintext');
var pwutils = require('../pwutils');

function showPage(req, res, page) {
  fs.readFile(page.targetFile.pathname, {encoding: 'utf8'}, _showFile);
  function _showFile (err, data) {
    if (err) {
      return res.send(500);
    }
    data = formatter.format(data);

    page.toolbar = [
      {href: page.editUrl, title: 'edits'}
    ];
    res.render('index', {
      title: 'Express',
      contents: data,
      page: page
    });
  }
}

function editPage(req, res, page) {
  fs.readFile(page.targetFile.pathname, {encoding: 'utf8'}, _showFile);
  function _showFile (err, data) {
    if (err) {
      return res.send(500);
    }
    page.toolbar = [
      {title: 'save', href: '#', id: 'toolbar-save'}
    ];
    res.render('editor', {
      contents: data,
      page: page
    });
  }
}

/* GET home page. */
router.get('/', function (req, res) {
  var indexFile = indexes.getIndex('');
  if (indexFile === undefined) {
    return res.send(500);
  }

  var page = {};
  page.toolbar = [];
  page.title = 'pagewriter';
  page.path = '/' + indexFile.relativePath;
  page.editUrl = '/' + indexFile.relativePath + '?mode=edit';
  page.targetFile = indexFile;
  console.log(page)
  showPage(req, res, page);
});

/* GET page */
router.get('/:target', function (req, res) {
  // validate path
  var target = req.params.target;
  if (!pwutils.validateRelativePath(target)) {
    return res.send(403);
  }

  // get target file
  var targetFile = pwutils.getPageAttr(target);
  if (targetFile === undefined) {
    return res.send(404);
  }

  var page = {};
  page.toolbar = [];
  page.targetFile = targetFile;
  page.editUrl = req.path + '?mode=edit';
  page.path = '/' + target;
  page.title = page.path + ' - pagewriter';


  if (req.query.mode == 'edit') {
    return editPage(req, res, page);
  }
  showPage(req, res, page);
});


module.exports = router;
