// networkCachebuster.js
// Overwrite all link and (optionally) script tags by adding Date.now() at the end of href and src attributes, respectively.
// By default processing scripts is not performed, you should change the variable processScripts to true to run these.

(() => {
  'use strict';
  var rep = /.*\?.*/,
    links = document.getElementsByTagName('link'),
    scripts = document.getElementsByTagName('script'),
    processScripts = false;
  for (var i = 0; i < links.length; i++) {
    var link = links[i],
      href = link.href;
    if (rep.test(href)) {
      link.href = href + '&' + Date.now();
    } else {
      link.href = href + '?' + Date.now();
    }
  }
  if (processScripts) {
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i],
        src = script.src;
      if (rep.test(src)) {
        script.src = src + '&' + Date.now();
      } else {
        script.src = src + '?' + Date.now();
      }
    }
  }
})();
