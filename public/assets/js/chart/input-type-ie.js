// Modernizr.load({
//   test: Modernizr.inputtypes.date,
//   nope: [
//     'http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
//     'http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js',
//     'jquery-ui.css'
//   ],
//   complete: function() {
//     $('input[type=date]').datepicker({
//       dateFormat: 'yy-mm-dd'
//     });
//   }
// });
window.addEventListener('load', set_input_type_date());

function set_input_type_date(){
  if (Modernizr.inputtypes.date == false) {

    // load the JQuery UI styles:
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery.ui.all.css';
    document.getElementsByTagName('head')[0].appendChild(link);

    // load JQuery:
    var newScript = document.createElement('script');
    newScript.src = '//code.jquery.com/jquery-1.10.2.js';
    document.getElementsByTagName('head')[0].appendChild(newScript);

    // jquery-ui.js depends on jquery-1.10.2.js being fully loaded,
    // so wait half a second:
    setTimeout(function(){
      var newScript = document.createElement('script');
      newScript.src = '//code.jquery.com/ui/1.11.4/jquery-ui.js';
      document.getElementsByTagName('head')[0].appendChild(newScript);

      // the datepicker plugin depends on jquery-ui.js being fully loaded,
      // so wait another half a second:
      setTimeout(function(){
        $('input[type=date]').datepicker({
          dateFormat: 'yy-mm-dd'
        });
      }, 500);

    }, 500);

  }
}