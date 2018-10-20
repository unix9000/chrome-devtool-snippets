// htmlContenti18n.js
// Generate downloadable chrome.i18n messages file for location.href.
// See http://developer.chrome.com/extensions/i18n.html
// - Messages are based on innerText or value attribute, keyed by class attribute.
// - $Placeholders$ are added to messages.json as well.
// - Generate downloadable HTML file with corresponding i18n-content attributes.
// - Generate downloadable script to initialize localized messages on load.
try {
  console.log(location.href);
  let hsh = {};
  let replacer = [];
  replacer.push('message', 'description', 'placeholders', 'content', 'example');
  let addKeyValuePlaceHolders = (messages, key, value) => {
    messages[key] = {
      'message': value,
      'description': value
    };
    let placeHolders = value.match(/\$([^$]+)\$/g);
    if (placeHolders) {
      messages[key].placeholders = {};
      for (j = 0, jlen = placeHolders.length; j < jlen; j++) {
        let placeHolderName = placeHolders[j].replace(/\$/g, '').toLowerCase();
        messages[key].placeholders[placeHolderName] = {
          'content': '$' + (j + 1),
          'example': value
        };
        if (!replacer.some((value) => {
          return value === placeHolderName;
        })) {
          replacer.push(placeHolderName);
        }
      }
    }
    return messages;
  };
  let i18nForValueAttribute = (select, messages) => {
    let nds = document.querySelectorAll(select);
    for (i = 0, len = nds.length; i < len; i++) {
      let value = nds[i].getAttribute('value');
      if (value) {
        let key = nds[i].className;
        if (key && value) {
          nds[i].setAttribute('i18n-content', key);
          // Better keep value for round-tripping.
          // nds[i].setAttribute('value', '');
          messages = addKeyValuePlaceHolders(messages, key, value);
        }
      }
    }
  };
  let i18nForInnerText = (select, messages) => {
    let nds = document.querySelectorAll(select);
    for (i = 0, len = nds.length; i < len; i++) {
      // Note we use .innerText because it preserves newline characters in Chrome, while .textContent loses them.
      let value = nds[i].innerText;
      if (nds[i].childElementCount === 0 && value) {
        let key = nds[i].className;
        let value = value.replace(/\s+/g, ' ').trim();
        if (key && value) {
          nds[i].setAttribute('i18n-content', key);
          // Better keep value for round-tripping.
          // nds[i].innerText = '';
          messages = addKeyValuePlaceHolders(messages, key, value);
        }
      }
    }
    let i18nNodes = document.querySelectorAll(select + '[i18n-content]');
    for (i = 0, len = i18nNodes.length; i < len; i++) {
      if (i18nNodes[i].hasAttribute('i18n-content') && i18nNodes[i].childElementCount > 0) {
        console.warn('HTML elements have been added to\n%O\nPlease only use text and named character references (%o)!',
          i18nNodes[i], 'https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Introduction#Named_character_references');
      }
    }
  };
  i18nForInnerText('*', hsh);
  i18nForValueAttribute('input[value]', hsh);
  Object.getOwnPropertyNames(hsh).sort().forEach(function (value) {
    replacer.push(value);
  });
  let messagesString = JSON.stringify(hsh, replacer, 4);
  let htmlFileText = '<!DOCTYPE ' + document.doctype.name + '>\n' + document.documentElement.outerHTML;
  let htmlFileName = location.pathname.split('/').pop();
  let makeDownloadLink = function (data, filename, style) {
    let blob = new window.Blob([data], {
      'type': 'text/utf-8'
    });
    let a = document.createElement('a');
    a.innerText = 'Download ' + filename;
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.setAttribute('style', style);
    a.onclick = function () {
      setTimeout(function () {
        document.body.removeChild(a);
      }, 500);
    };
  };
  let applyChromeI18nMessages = () => {
    // This generated function body is wrapped in (...)(); to execute on load.
    // This will only install the onreadystatechange event handler
    // to be run when the document load is complete.
    // Load this file into the associated HTML file by including
    // <script src="applyChromeI18nMessages.js"></script>
    // in its head element.
    try {
      document.addEventListener('readystatechange', function (event) {
        if (event.target.readyState !== 'complete') {
          return;
        }
        if (!chrome.i18n) {
          console.warn('chrome.i18n is undefined.\n%s\nis %cnot%c viewed as part of a chrome extension.', document.URL, 'font-weight: bold', '');
          return;
        }
        (() => {
          let nds = document.querySelectorAll('[i18n-content]');
          for (i = 0, len = nds.length; i < len; i++) {
            let value = nds[i].getAttribute('value');
            let key = nds[i].getAttribute('i18n-content');
            if (value === null) {
              // TODO Please note we use .innerText because it preserves newline characters in Chrome, while .textContent loses them.
              nds[i].innerText = chrome.i18n.getMessage(key);
            } else {
              nds[i].setAttribute('value', chrome.i18n.getMessage(key));
            }
          }
        })();
      }, false);
    } catch (exception) {
      window.alert('exception.stack: ' + exception.stack);
      console.log((new Date()).toJSON(), 'exception.stack:', exception.stack);
    }
  };
  makeDownloadLink(messagesString, 'messages.json', 'position:fixed;top:2em;left:50%;opacity:0.5');
  makeDownloadLink(htmlFileText, htmlFileName, 'position:fixed;top:4em;left:50%;opacity:0.5');
  makeDownloadLink('(' + applyChromeI18nMessages + ')();', 'applyChromeI18nMessages.js', 'position:fixed;top:6em;left:50%;opacity:0.5');
} catch (exception) {
  console.log(exception.stack);
}
