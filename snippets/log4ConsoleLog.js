// log4ConsoleLog.js
// Adds a `log` function to window object.
// More infos: https://developer.mozilla.org/de/docs/Web/API/Console

(() => {
  'use strict';
  window.log = console.log.bind(console);
})();

/*
Every time I start a new project, I want to pull in a log function that allows the same functionality as the console.log,
including the full functionality of the Console API.

This is an attempt to once and for all document the function that I pull in to new projects. There are two different options:

- The full version: Inspired by the plugin in HTML5 Boilerplate. Use this if you are writing an application and want to create a window.log function. Additionally, this will set all the console methods to an empty function if they don't exist to prevent errors from accidental console.log calls left in your code. Put this snippet at the top of the rest of your scripts - it will need to be evaluated first thing to work.

- The portable version: Use this if you want to use it inside a plugin and/or don't want to muck with the global namespace. Just drop it at the bottom of your plugin and log away. log can be called before the function declaration, and will not add anything to the window namespace or modify the console objects.

Full version of `log` that:
Prevents errors on console methods when no console present.
Exposes a global 'log' function that preserves line numbering and formatting.
(function () {
  var method;
  var noop = function () { };
  var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];
    // Only stub undefined methods.
    if (!console[method]) {
        console[method] = noop;
    }
  }
  if (Function.prototype.bind) {
    window.log = Function.prototype.bind.call(console.log, console);
  } else {
    window.log = function() {
      Function.prototype.apply.call(console.log, console, arguments);
    };
  }
})();


Portable version of `log` that:
Doesn't expose log to the window.
Allows log() to be called above the function declaration.
Because of this, you can just throw it in the bottom of a plugin and it won't mess with global scope or clutter your code
(function() {
  // Your code here...  log() away
  function log () {
    if (window.console) {

      // Only run on the first time through - reset this function to the appropriate console.log helper
      if (Function.prototype.bind) {
          log = Function.prototype.bind.call(console.log, console);
      }
      else {
          log = function() {
            Function.prototype.apply.call(console.log, console, arguments);
          };
      }
      log.apply(this, arguments);
    }
  }
})();
// All at once (minified version):
function log(){if(window.console){if(Function.prototype.bind)log=Function.prototype.bind.call(console.log,console);else log=function(){Function.prototype.apply.call(console.log,console,arguments);};log.apply(this,arguments);}}

// require.js module
define([], function() {
  "use strict";
  var exports = {};
  exports.log = (function() {
      var noop = function() {};
      var log;
      log = (window.console === undefined) ? noop
          : (Function.prototype.bind !== undefined) ? Function.prototype.bind.call(console.log, console)
          : function() { Function.prototype.apply.call(console.log, console, arguments); };
      return log;
  })();
  return exports;
})
*/
