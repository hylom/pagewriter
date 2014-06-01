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

    data = formatter.format(data);
    res.render('index', {
      title: 'Express',
      contents: data,
      page: page
    });
  }
}

function showPage(req, res, page) {
  var target = req.params.target;
  if (!pwutils.validateRelativePath(target)) {
    return res.send(403);
  }

  var targetFile = pwutils.getPageAttr(target);
  if (targetFile === undefined) {
    return res.send(404);
  }

  fs.readFile(targetFile.pathname, {encoding: 'utf8'}, _showFile);

  function _showFile (err, data) {
    if (err) {
      return res.send(500);
    }
    data = formatter.format(data);
    res.render('index', {
      title: 'Express',
      contents: data,
      page: page
    });
  }
}

function editPage(req, res, page) {
  
}

/* GET home page. */
router.get('/', function (req, res) {
  var page = {};
  page.editUrl = '#';
  showIndex(req, res, page);
});

router.get('/:target', function (req, res) {
  var page = {};
  page.editUrl = req.path + '?mode=edit';
  if (req.query.mode == 'edit') {
    return editPage(req, res, page);
  }
  showPage(req, res, page);
});


module.exports = router;
