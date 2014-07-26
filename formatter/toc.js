
var pwutils = require('../pwutils');

var formatter = {};

formatter.format = function (text) {
  var counter = 0;
  var directory = '';
  text = text.replace(/.*/g, formatLine);
  var header = '<table><tbody>';
  var footer = '</tbody></table>';
  return header + text + footer;

  function formatText(text) {
    var texts = text.replace('\n', '').split('\t');
    var ret = {
      title: '',
      pages: 2
    };
    ret.title = texts[0];
    if (texts.length < 2) {
      return ret;
    }
    var n = Number(texts[1]);
    if ((n !== NaN) && (texts[1] !== '')) {
      ret.pages = n;
    }
    return ret;
  };

  function formatLine(text) {
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
          return '<tr class="chapter"><td colspan="3">' + chapter + '</td></tr>';
        }
      }
      return '';
    }

    var texts = formatText(text);
    counter++;
    var ret = '<tr>';
    ret += '<td>' + counter + '</td>';
    ret += '<td><a href="' + directory + pwutils.escapeFilename(texts.title) + '.txt">'
      + texts.title + '</a></td>\n';
    ret += '<td>' + texts.pages + '</td>';
    ret += '</tr>\n';
    return ret;
  };

};

module.exports = formatter;
