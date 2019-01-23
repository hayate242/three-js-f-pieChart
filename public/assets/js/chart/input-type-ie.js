Modernizr.load({
  test: Modernizr.inputtypes.date,
  nope: [
    'http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
    'http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js',
    'jquery-ui.css'
  ],
  complete: function() {
    $('#date_selection_start').datepicker({
      dateFormat: 'yy-mm-dd'
    });
  }
});