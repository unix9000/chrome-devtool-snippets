// cssOverlay.js
// draw an css overlay
'use strict';
let storageKey = 'overlay-default';
let overlayDefault = localStorage.getItem(storageKey) || '';
let url = prompt('paste overlay url', overlayDefault);
if (url) {
  localStorage.setItem(storageKey, url);
  let overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundImage = 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)';
  overlay.style.backgroundSize = '75px 75px';
  overlay.style.zIndex = 10000;
  overlay.style.opacity = 0.5;
  document.body.appendChild(overlay);
}
