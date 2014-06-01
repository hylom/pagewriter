var fs = require('fs');

var pwutils = require('../pwutils');
var express = require('express');
var router = express.Router();

router.post('/save', function (req, res) {
  var rpath = req.body.target;
  var contents = req.body.contents;

  console.log(contents);
  console.log(rpath);
  if (!pwutils.validateRelativePath(rpath)) {
    return res.send(403);
  }

  var pageAttr = pwutils.getPageAttr(rpath);
  var err = fs.writeFileSync(pageAttr.pathname, contents);
  if (err) {
    return res.json({status: 'failed'});
  }
  return res.json({status: 'ok'});
});

module.exports = router;
