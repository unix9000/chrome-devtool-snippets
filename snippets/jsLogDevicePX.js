// jsLogDevicePX.js
// log browser window hight, width and divce pixel ratio
(() => {
  'use strict';

  const diviceXY = () => {
    let de = document.documentElement,
      diviceY = window.innerHeight || self.innerHeight || (de && de.clientHeight) || document.body.clientHeight,
      diviceX = window.innerWidth || self.innerWidth || (de && de.clientWidth) || document.body.clientWidth,
      devicePixelRatio = window.devicePixelRatio,
      diviceXYD = [];

    diviceXYD.push({
      height: diviceY,
      width: diviceX,
      ratio: devicePixelRatio
    });
    console.log('divice_XYD w' + diviceX + '| h' + diviceY + '|' + devicePixelRatio);
    console.groupCollapsed('device pixel');
    console.table(diviceXYD, ['height', 'width', 'ratio']);
    console.groupEnd('device pixel');
  };
  diviceXY();

  window.addEventListener('resize', function (e) {
    diviceXY();
  });
})();
