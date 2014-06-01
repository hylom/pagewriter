var fs = require('fs');

var path = require('path');
var pwutils = require('../pwutils');
var express = require('express');
var router = express.Router();

router.post('/save', function (req, res) {
  var rpath = req.body.target;
  var contents = req.body.contents;

  //console.log(rpath);
  //console.log(contents);

  if (!pwutils.validateRelativePath(rpath)) {
    return res.send(403);
  }

  var pageAttr = pwutils.getPageAttr(rpath);
  //console.log(pageAttr.pathname);
  // check if directory exists
  var dirname = path.dirname(pageAttr.pathname);
  //console.log(pageAttr.pathname);
  //console.log(dirname);
  if (!fs.existsSync(dirname)) {
    var err = fs.mkdirSync(dirname);
    if (err) {
      res.status(500);
      return res.render('error', {
        message: 'Directory cannot create',
        error: {},
        page: page.createPage()
      });
    }
  }

  var err = fs.writeFileSync(pageAttr.pathname, contents);
  if (err) {
    return res.json({status: 'failed'});
  }
  return res.json({status: 'ok'});
});

module.exports = router;
