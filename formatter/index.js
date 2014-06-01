// formatter/index.js

var formatter = {};
var formatters = {
  '.txt': require('./plaintext'),
  '.toc': require('./toc')
}


formatter.format = function (text, type) {
  type = type || '.txt';
  var fmt = formatters[type];
  if (fmt === undefined) {
    fmt = formatters['.txt'];
  }
  return fmt.format(text);
};

module.exports = formatter;
