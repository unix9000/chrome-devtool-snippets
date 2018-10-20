// cssReload.js
// Removes then reloads all the CSS files in the current page

(() => {
  'use strict';
  const insertAfter = (newElement, targetElement) => {
    var parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  };

  const reloadStyleSheet = (stylesheet) => {
    var element = stylesheet.ownerNode;
    var clone = element.cloneNode(false);
    clone.href = addRandomToUrl(clone.href);
    clone.addEventListener('load', function () {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    insertAfter(clone, element);
  };

  const addRandomToUrl = (input) => {
    // prevent CSS caching
    var hasRnd = /([?&])_=[^&]*/,
      hasQueryString = /\?/,
      hasHash = /(.+)#(.+)/,
      hash = null,
      rnd = Math.random();

    var hashMatches = input.match(hasHash);
    if (hashMatches) {
      input = hashMatches[1];
      hash = hashMatches[2];
    }
    var url = hasRnd.test(input)
      ? input.replace(hasRnd, '$1_=' + rnd)
      : input + (hasQueryString.test(input) ? '&' : '?') + '_=' + rnd;
    if (hash) url += '#' + hash;
    return url;
  };

  [].forEach.call(document.styleSheets, function (styleSheet) {
    if (!styleSheet.href) return;
    console.log('reload ' + styleSheet.href);
    reloadStyleSheet(styleSheet);
  });
})();
