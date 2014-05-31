var fs = require('fs');

var express = require('express');
var router = express.Router();

var indexes = require('../indexes');

/* GET home page. */
router.get('/', function(req, res) {
  indexFile = indexes.getIndex('/');
  if (indexFile === undefined) {
    return res.send(500);
  }

  console.log(indexFile);
  fs.readFile(indexFile.pathname, {encoding: 'utf8'}, _showFile);

  function _showFile (err, data) {
    if (err) {
      return res.send(500);
    }
    res.render('index', {
      title: 'Express',
      contents: data
    });
  }
});

module.exports = router;
