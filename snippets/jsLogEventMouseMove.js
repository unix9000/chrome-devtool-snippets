// jsLogEventMouseMove.js
// Log the current mouse postion on move
(() => {
  'use strict';

  let findScreenCoords = (mouseEvent) => {
    var xpos;
    var ypos;
    if (mouseEvent) {
    // FireFox
      xpos = mouseEvent.screenX;
      ypos = mouseEvent.screenY;
    } else {
    // IE
      xpos = window.event.screenX;
      ypos = window.event.screenY;
    }
    // document.getElementById('screenCoords').innerHTML = xpos + ', ' + ypos;
    console.log('X' + xpos + ' | Y' + ypos);
  };
  document.body.addEventListener('mousemove', findScreenCoords, false);
})();
