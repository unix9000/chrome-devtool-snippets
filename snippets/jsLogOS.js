// jsLogOS.js
// log system and browser infos
(() => {
  'use strict';

  // local stuff
  // =================================================================================  get standard info
  var os = [],
    nOSP = navigator.platform,
    nOSX = '',
    nOSV = '',
    nLng = navigator.language,
    nAgt = navigator.userAgent,
    nNam = navigator.appName,
    nMedia = navigator.mediaDevices,
    nVer = '' + parseFloat(navigator.appVersion),
    nVem = parseInt(navigator.appVersion, 10),
    nCCE = navigator.cookieEnabled,
    nNet = window.navigator.onLine,
    nNamOffset, nVerOffset, ix, nLSE, nServiceWorker, ipNum, ipLng, nOSM;

    // =================================================================================  get browsername
    // In Opera 15+, the true version is after "OPR/"
  if ((nVerOffset = nAgt.indexOf('OPR/')) !== -1) {
    nNam = 'Opera';
    nVer = nAgt.substring(nVerOffset + 4);
  }
  // In older Opera, the true version is after "Opera" or after "Version"
  else if ((nVerOffset = nAgt.indexOf('Opera')) !== -1) {
    nNam = 'Opera';
    nVer = nAgt.substring(nVerOffset + 6);
    if ((nVerOffset = nAgt.indexOf('Version')) !== -1) {
      nVer = nAgt.substring(nVerOffset + 8);
    }
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((nVerOffset = nAgt.indexOf('MSIE')) !== -1) {
    nNam = 'Microsoft Internet Explorer';
    nVer = nAgt.substring(nVerOffset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((nVerOffset = nAgt.indexOf('Chrome')) !== -1) {
    nNam = 'Chrome';
    nVer = nAgt.substring(nVerOffset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((nVerOffset = nAgt.indexOf('Safari')) !== -1) {
    nNam = 'Safari';
    nVer = nAgt.substring(nVerOffset + 7);
    if ((nVerOffset = nAgt.indexOf('Version')) != -1) { nVer = nAgt.substring(nVerOffset + 8); }
  }
  // In Firefox, the true version is after "Firefox"
  else if ((nVerOffset = nAgt.indexOf('Firefox')) !== -1) {
    nNam = 'Firefox';
    nVer = nAgt.substring(nVerOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if ((nNamOffset = nAgt.lastIndexOf(' ') + 1) <
              (nVerOffset = nAgt.lastIndexOf('/'))) {
    nNam = nAgt.substring(nNamOffset, nVerOffset);
    nVer = nAgt.substring(nVerOffset + 1);
    if (nNam.toLowerCase() === nNam.toUpperCase()) {
      nNam = navigator.appName;
    }
  }
  // trim the nVer string at semicolon/space if present
  if ((ix = nVer.indexOf(';')) !== -1) { nVer = nVer.substring(0, ix); }
  if ((ix = nVer.indexOf(' ')) !== -1) { nVer = nVer.substring(0, ix); }

  nVem = parseInt('' + nVer, 10);
  if (isNaN(nVem)) {
    nVer = '' + parseFloat(navigator.appVersion);
    nVem = parseInt(navigator.appVersion, 10);
  }
  os.push({
    browserName: nNam,
    browserVersion: nVer,
    browserLng: nLng
  });

  // ==================================================================================  get OS name

  // mobile version
  var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

  // system
  var clientStrings = [
    {s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
    {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
    {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
    {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
    {s: 'Windows Vista', r: /Windows NT 6.0/},
    {s: 'Windows Server 2003', r: /Windows NT 5.2/},
    {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
    {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
    {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
    {s: 'Windows 98', r: /(Windows 98|Win98)/},
    {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
    {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
    {s: 'Windows CE', r: /Windows CE/},
    {s: 'Windows 3.11', r: /Win16/},
    {s: 'Android', r: /Android/},
    {s: 'Open BSD', r: /OpenBSD/},
    {s: 'Sun OS', r: /SunOS/},
    {s: 'Linux', r: /(Linux|X11)/},
    {s: 'iOS', r: /(iPhone|iPad|iPod)/},
    {s: 'Mac OS X', r: /Mac OS X/},
    {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
    {s: 'QNX', r: /QNX/},
    {s: 'UNIX', r: /UNIX/},
    {s: 'BeOS', r: /BeOS/},
    {s: 'OS/2', r: /OS\/2/},
    {s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
  ];
  for (var id in clientStrings) {
    var cs = clientStrings[id];
    if (cs.r.test(nAgt)) {
      nOSX = cs.s;
      break;
    }
  }

  // =================================================================================  get OS version
  if (/Windows/.test(nOSX)) {
    nOSV = /Windows (.*)/.exec(nOSX)[1];
    nOSX = 'Windows';
  }
  switch (nOSX) {
    case 'Mac OS X':
      nOSV = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
      break;
    case 'Android':
      nOSV = /Android ([\.\_\d]+)/.exec(nAgt)[1];
      break;
    case 'iOS':
      nOSV = /OS (\d+)_(\d+)_?(\d+)?/.exec(nAgt)[1];
      break;
  }

  if ((mobile === true)) {
    nOSM = true;
  } else {
    nOSM = false;
  }

  if ((nNet === true)) {
    nNet = true;
  } else {
    nNet = false;
  }

  var nOSPXV = nOSP + '/' + nOSX + ' ' + nOSV;
  os.push({
    systemOS: nOSP,
    systemPlatform: nOSX,
    systemVersion: nOSV,
    systemIsMobile: nOSM,
    systemIsOnline: nNet
  });

  // =================================================================================  get localStorage info
  try {
    var storage = window.localStorage; storage.setItem('nLSE', '1'); storage.removeItem('nLSE');
    nLSE = true;
  } catch (e) {
    nLSE = false;
  }

  var nDNT = false;
  if ((navigator.doNotTrack === '0') || (navigator.doNotTrack === 'no') || (navigator.msDoNotTrack === '0')) {
    nDNT = false;
  } else if ((navigator.doNotTrack === '1') || (navigator.doNotTrack === 'yes') || (navigator.msDoNotTrack === '1')) {
    nDNT = true;
  }

  if ('serviceWorker' in navigator) {
    nServiceWorker = true;
  } else {
    nServiceWorker = false;
  }

  os.push({
    browserCookieEnabled: nCCE,
    browserLocalStorageEnabled: nLSE,
    browserDoNotTrackEnabled: nDNT,
    browserServiceWorkerEnabled: nServiceWorker
  });

  os = Object.assign({}, os[0], os[1], os[2]);
  console.log('os', os);
  ipNum = '0.0.0.0';
  ipLng = nLng;

  // ========================================================================================  set Data /  storage or DOM
  console.groupCollapsed('os');
  console.table(os, [
    'systemOS',
    'systemPlatform',
    'systemVersion',
    'systemIsMobile',
    'systemIsOnline',
    'browserName',
    'browserVersion',
    'browserLng',
    'browserCookieEnabled',
    'browserLocalStorageEnabled',
    'browserDoNotTrackEnabled'
  ]);
  console.groupEnd('os');
})();
