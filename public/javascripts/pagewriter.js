// pagewriter.js

// for editor
var editor = {};

editor.save = function (event) {
  var e = $('#contents-editor');
  var contents = e.val();
  var data = {
    contents: contents,
    target: e.attr('pw-path')
  };
  var jqxhr = $.post('/api/save', data, editor.onSaved);
  jqxhr.fail(function (jqXHR, status, err) {
    alert('save failed!');
  });
};

editor.onSaved = function (data, textStatus, jqXHR) {
  if (data.status == 'ok') {
    var date = new Date();
    var timestamp = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    $('#toolbar-status').text('saved at ' + timestamp);
  } else {
    alert('save failed!');
  }
};

// onLoad
$(document).ready(function () {
  $('#toolbar-save').on('click', editor.save);
});
