var fs = require('fs');

var express = require('express');
var router = express.Router();

var indexes = require('../indexes');
var formatter = require('../formatter/plaintext');
var pwutils = require('../pwutils');

function showIndex(req, res, page) {
  var indexFile = indexes.getIndex('/');
  if (indexFile === undefined) {
    return res.send(500);
  }

  fs.readFile(indexFile.pathname, {encoding: 'utf8'}, _showFile);

  function _showFile (err, data) {
    if (err) {
      return res.send(500);
    }

    page.toolbar = [
      {href: indexFile.relativePath + '?mode=edit', title: 'edits'}
    ];
    data = formatter.format(data);
    res.render('index', {
      title: 'Express',
      contents: data,
      page: page
    });
  }
}

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
      {title: 'save', href: '#'}
    ];
    res.render('editor', {
      title: 'Express',
      contents: data,
      page: page
    });
  }
}

/* GET home page. */
router.get('/', function (req, res) {
  var page = {};
  page.toolbar = [{title: 'edit', href:'#'}];
  page.title = 'pagewriter';
  page.path = '/';
  page.editUrl = '#';
  showIndex(req, res, page);
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
