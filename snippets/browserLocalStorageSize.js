// browser_local-storage-size.js
// based on answer to question
// http://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage
(() => {
  'use strict';
  const stringSizeBytes = (str) => {
    return str.length * 2;
  };

  const toMB = (bytes) => {
    return bytes / 1024 / 1024;
  };

  const toSize = (key) => {
    return {
      name: key,
      size: stringSizeBytes(localStorage[key])
    };
  };

  const toSizeMB = (info) => {
    info.size = toMB(info.size).toFixed(2) + ' MB';
    return info;
  };

  let sizes = Object.keys(localStorage).map(toSize).map(toSizeMB);

  console.table(sizes);
})();
