// jsLogEventClickedTarget.js
// Useful for finding target node attributes and values
(() => {
  'use strict';

  document.addEventListener('click', function (e) {
    var event = e || window.e,
      target = event.target || event.srcElement,
      targetAttrs = target.attributes,
      targetAttrsLen = targetAttrs.length,
      targets = [];

    for (var i = 0; i < targetAttrsLen; i++) {
      var targetAttrIndex = [i] + 1,
        targetAttrNodeName = target.attributes[i].nodeName,
        targetAttrNodeValue = target.attributes[i].value;

      targets.push({
        index: targetAttrIndex,
        nodeName: targetAttrNodeName,
        nodeValue: targetAttrNodeValue
      });
    }

    console.groupCollapsed('targets');
    console.table(targets, ['index', 'nodeName', 'nodeValue']);
    console.groupEnd('targets');
  }, false);
})();
