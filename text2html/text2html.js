/* text2html.js */

var text2html = {};

text2html.formatText = function formatText(text) {
  var lines = text.split('\n');
  var modeFlags = {};

  var execMode = {};
  execMode.enter = {
    test: function(str) { return /^＊---/.test(str); },
    action: function(str) { return '<pre class="execution">'; }
  }
  execMode.exit = {
    test: function(str) { return /^＊---/.test(str); },
    action: function(str) { return '</pre>'; }
  }
  execMode.flag = false;

  var listMode = {};
  listMode.enter = {
    test: function(str) { return /^＋---/.test(str); },
    action: function(str) { return '<pre class="list">'; }
  }
  listMode.exit = {
    test: function(str) { return /^＋---/.test(str); },
    action: function(str) { return '</pre>'; }
  }
  listMode.flag = false;

  var paragraph = {
    test: function(str) { return /^　/.test(str); },
    action: function(str) { return '<p>' + str + '</p>\n'; },
    break: true,
  };

  var header1 = {
    test: function(str) { return /^■/.test(str); },
    action: function(str) { return '<h1>' + str.slice(1) + '</h1>\n'; },
    break: true,
  };

  var header2 = {
    test: function(str) { return /^●/.test(str); },
    action: function(str) { return '<h2>' + str.slice(1) + '</h2>\n'; },
    break: true,
  };

  var header3 = {
    test: function(str) { return /^○/.test(str); },
    action: function(str) { return '<h3>' + str + '</h3>\n'; },
    break: true,
  };

  var entitize = {
    test: function(str) { return true; },
    action: function(str) {
      str = str.replace(/&/g, '&amp;');
      str = str.replace(/</g, '&lt;');
      str = str.replace(/>/g, '&gt;');
      return str
    },
    break: false,
  };

  var raw = {
    test: function(str) { return !(/^$/.test(str)); },
    action: function(str) { return str + '<br/>'; },
    break: false,
  };



  var modes = [execMode, listMode];
  var converters = [
    entitize,
    paragraph,
    header1,
    header2,
    header3,
    raw
  ];

  for (var i = 0; i < lines.length; i++) {
    var currentLine = lines[i];

    for (var j = 0; j < converters.length; j++) {
      var converter = converters[j];
      if (converter.test(currentLine)) {
        currentLine = converter.action(currentLine);
        if (converter.break) {
          break;
        }
      }
    }

    modes.forEach(function (mode) {
      if (mode.flag) {
        if (mode.exit.test(currentLine)) {
          currentLine = mode.exit.action(currentLine);
          mode.flag = false;
        }
      } else {
        if (mode.enter.test(currentLine)) {
          currentLine = mode.enter.action(currentLine);
          mode.flag = true;
        }
      }
    });

    lines[i] = currentLine;
  }
  return lines;
};

module.exports = text2html;

if (require.main == module) {
  // This file directly executed by node command
  var buf = '';
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      buf += chunk;
    }
  });

  process.stdin.on('end', function () {
    var lines = text2html.formatText(buf);
    for (var i = 0; i < lines.length; i++) {
      process.stdout.write(lines[i]);
      process.stdout.write('\n');
    }
  });
}
