

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

  console.log(text);
  return text;
};

module.exports = formatter;
