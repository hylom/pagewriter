

var formatter = {};

formatter.format = function (text) {
  text = text.replace(/.*/g, formatText);

  function formatText(text) {
    if (text.length == 0) {
      return '';
    } else {
      return '<p>' + text + '</p>\n';
    }
  };

  return '<div class="body-text">' + text + '</div>';
};

module.exports = formatter;
