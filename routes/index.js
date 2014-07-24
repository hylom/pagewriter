var fs = require('fs');

var express = require('express');
var router = express.Router();
var url = require('url');

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

    var template = 'format/toc';
    if (newPage.targetFile.type === '.txt') {
      template = 'format/plaintext';
    }

    res.render(template, {
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

function createPage(req, res, newPage) {
  var newPage = page.createPage();
  var targetFile = pwutils.getPageAttr(req.path);
  newPage.targetFile = targetFile;
  newPage.editUrl = req.path + '?mode=edit';
  newPage.path = req.path;
  newPage.title = newPage.path + ' - pagewriter';
  newPage.toolbar = [
    {title: 'save', href: '#', id: 'toolbar-save'}
  ];
  res.render('editor', {
    contents: '',
    page: newPage
  });
}

function showEmptyPage(req, res) {
  var newPage = page.createPage();
  newPage.targetFile = pwutils.getPageAttr(req.path);
  newPage.editUrl = req.path + '?mode=create';
  newPage.path = req.path;
  newPage.title = newPage.path + ' - pagewriter';
  newPage.toolbar = [{title: 'create', href: newPage.editUrl}];
  res.render('empty', {
    page: newPage
  });
}

/* GET home page. */
router.get('/', function (req, res) {
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
router.get('/*', function (req, res) {
  var target = req.path;
  if (!pwutils.validateRelativePath(target)) {
    return res.send(403);
  }

  if (req.query.mode == 'create') {
    return createPage(req, res);
  }

  // get target file
  var targetFile = pwutils.getPageAttr(target);
  if (!fs.existsSync(targetFile.pathname)) {
    return showEmptyPage(req, res);
  }

  var newPage = page.createPage();
  newPage.targetFile = targetFile;
  newPage.editUrl = req.path + '?mode=edit';
  newPage.path = req.path;
  newPage.title = newPage.path + ' - pagewriter';

  if (req.query.mode == 'edit') {
    return editPage(req, res, newPage);
  }
  return showPage(req, res, newPage);
});


module.exports = router;
