
var text2html = require('../text2html/text2html');

var formatter = {};
var header = '<div class="body-text">';
var footer = '</div>';

var rawFormatter = function (text) {
  text = text.replace(/.*/g, formatText);

  function formatText(text) {
    if (text.length == 0) {
      return '';
    } else {
      return '<p>' + text + '</p>\n';
    }
  };

  return header + text + footer;
};

var newFormatter = function (text) {
  var lines = text2html.formatText(text);
  lines.unshift(header);
  lines.push(footer);
  return lines.join('');
}


formatter.format = newFormatter;

module.exports = formatter;
