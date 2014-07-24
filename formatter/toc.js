
var pwutils = require('../pwutils');

var formatter = {};

formatter.format = function (text) {
  var counter = 0;
  var directory = '';
  text = text.replace(/.*/g, formatText);
  var header = '<table><tbody>';
  var footer = '</tbody></table>';

  function formatText(text) {
    if (text.length == 0) {
      return '';
    }
    if (text.charAt(0) == '#') {
      if (text.charAt(1) == '@') {
        // @プラグマの処理
        // directoryプラグマ
        var match = text.match(/^#@directory:\s*(.*?)\s*$/);
        if (match) {
          directory = match[1];
          if ((directory.length > 1)
              && (directory.charAt(directory.length - 1) != '/')) {
            directory = directory + '/';
          }
        }
        // chapterプラグマ
        var match = text.match(/^#@chapter:\s*(.*?)\s*$/);
        if (match) {
          var chapter = match[1];
          return '<tr class="chapter"><td colspan="2">' + chapter + '</td></tr>';
        }
      }
      return '';
    }


    text = text.replace('\n', '');
    text = text.replace('\t', '');
    counter++;
    var ret = '<tr>';
    ret += '<td>' + counter + '</td>';
    ret += '<td><a href="' + directory + pwutils.escapeFilename(text) + '.txt">'
      + text + '</a></td>\n';
    ret += '</tr>\n';
    return ret;
  };

  return header + text + footer;
};

module.exports = formatter;
