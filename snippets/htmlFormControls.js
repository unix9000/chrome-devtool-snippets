// htmlFormControls.js
// Print out forms and their controls
// Shows all html form elements with their values and types in a nice table. Adds a new table for each form on the page.

(() => {
  'use strict';
  var forms = document.querySelectorAll('form');

  for (var i = 0, len = forms.length; i < len; i++) {
    let tab = [ ];

    console.group('HTMLForm "' + forms[i].name + '": ' + forms[i].action);
    console.log('Element:', forms[i], '\nName:    ' + forms[i].name + '\nMethod:  ' + forms[i].method.toUpperCase() + '\nAction:  ' + forms[i].action || 'null');

    ['input', 'textarea', 'select'].forEach(function (control) {
      [].forEach.call(forms[i].querySelectorAll(control), function (node) {
        tab.push({
          'Element': node,
          'Type': node.type,
          'Name': node.name,
          'Value': node.value,
          'Pretty Value': (isNaN(node.value) || node.value === '' ? node.value : parseFloat(node.value))
        });
      });
    });

    console.table(tab);
    console.groupEnd();
  }
})();
