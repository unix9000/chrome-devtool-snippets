// logSaveConsoleLogs.js
// A simple way to save objects as .json files from the console, includes a chrome extension along with a plain script.
// usage:
// In case you have an object logged:
// 1. Right click on the object in console and click Store as a global variable
// 2. the output will be something like temp1
// 3. console.save(temp1, [filename])
// 4. Chrome ask you save the file
((console) => {
  'use strict';
  console.save = function (data, filename) {
    if (!data) {
      console.error('Console.save: No data');
      return;
    }

    if (!filename) filename = 'console.json';

    if (typeof data === 'object') {
      data = JSON.stringify(data, undefined, 4);
    }

    var blob = new Blob([data], {type: 'text/json'}),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  };
})(console);
