// jsJSON.js
// JSON Utils
(() => {
  'use strict';

  /**
   * ajaxUtils - created 2018-07-13 ES5 Syntax
   * fetch API  - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * @param method {string} - opts.: GET, POST, PUT, DELETE, etc.
   * @param headers {object} - opts.: "Content-Type": 'application/json; charset=utf-8', "application/x-www-form-urlencoded",
   * @param body {object} - note: body data type must match "Content-Type" header
   *
   * @param mode {string} [mode=same-origin] - opts.: no-cors, cors, *same-origin
   * @param cache {string} [cache=no-cache] - opts.: *no-cache, reload, force-cache, only-if-cached
   * @param credentials {string} [credentials=omit] - opts.: include, same-origin, *omit
   * @param redirect {string} [redirect=follow] - opts.: manual, *follow, error
   * @param referrer {string} [referrer=client]   - optional, opts.: no-referrer, *client
   * @returns json {object}
   * API default
   * NOTE: IE11 needs polyfill
   * https://github.com/lahmatiy/es6-promise-polyfill
   * https://github.com/github/fetch
   */

  const status = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
  };

  const json = (response) => {
    return response.json();
  };

  /// ///////////// get
  const get = (url) => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(status)
        .then(json)
        .then((data) => {
          return resolve(data);
        }).catch((err) => {
          console.error('ajaxUtil.get(req) failed', err);
          return reject(new Error(err));
        });
    });
  };

  /// ///////////// post
  const post = (url, data) => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrer: 'no-referrer'
      })
        .then(status)
        .then(json)
        .then((data) => {
          return resolve(data);
        }).catch((err) => {
          console.error('ajaxUtil.post(res) failed', err);
          return reject(new Error(err));
        });
    });
  };

  /// ///////////// ajax - full fetch API
  const ajax = (url, data, opt) => {
    var request = {},
      method = !opt.hasOwnProperty('method') ? 'POST' : opt.method,
      headers = !opt.hasOwnProperty('headers') ? {'Content-Type': 'application/json; charset=utf-8'} : opt.headers,
      mode = !opt.hasOwnProperty('mode') ? 'cors' : opt.mode,
      cache = !opt.hasOwnProperty('cache') ? 'no-cache' : opt.cache,
      credentials = !opt.hasOwnProperty('credentials') ? 'same-origin' : opt.credentials,
      redirect = !opt.hasOwnProperty('redirect') ? 'follow' : opt.redirect,
      referrer = !opt.hasOwnProperty('referrer') ? 'no-referrer' : opt.referrer;

    request = {
      method: method,
      headers: headers,
      mode: mode,
      cache: cache,
      credentials: credentials,
      redirect: redirect,
      referrer: referrer
    };

    var reqBody = {body: JSON.stringify(data)};
    typeof data !== 'undefined' &&
    typeof data === 'object' ? Object.assign(request, reqBody) : console.log('NO BODY');

    return new Promise((resolve, reject) => {
      fetch(url, request)
        .then(status)
        .then(json)
        .then((data) => {
          return resolve(data);
        }).catch((err) => {
          console.error('ajaxUtil.ajax(res) failed', err);
          return reject(new Error(err));
        });
    });
  };

  // JSON UTILS
  /**
     * tryParseJson
     * tries to parse a json like thing into real json
     * @param json a json like thing
     * @returns real json
     */
  const tryParseJson = (json) => {
    var obj;

    try {
      if (typeof json === 'string') {
        obj = JSON.parse(json);
      } else {
        obj = json;
      }

      if (obj && typeof obj === 'object') {
        return obj;
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * filterJson
   * filter json object
   * @param {*} jsonItems an json object
   * @param {*} filter a {'key': new RegExp(filterValue)}
   * @returns filtered json object
   */
  const filterJson = (jsonItems, filter) => {
    var itemFilter = function (filter, item) {
      if (filter instanceof Function) {
        return filter(item);
      } else if (filter instanceof Array) {
        for (var k = 0; k < filter.length; ++k) {
          if (itemFilter(filter[k], item)) return true;
        }
        return false;
      } else if (typeof (item) === 'string' && filter && filter.test && filter.exec) {
        return filter.test(item);
      } else if (item === item + 0 && filter && (filter.lt || filter.gt || filter.le || filter.ge)) {
        // item is number and filter contains min-max
        return ((!('lt' in filter) || item < filter.lt) &&
                  (!('gt' in filter) || item > filter.gt) &&
                  (!('le' in filter) || item <= filter.le) &&
                  (!('ge' in filter) || item >= filter.ge));
      } else if (typeof (filter) === 'object') {
        for (var key in filter) {
          if (!itemFilter(filter[key], item[key])) { return false; }
        }
        return true;
      }
      return (filter === item);
    };

    var filtered = [];
    for (var k = 0; k < jsonItems.length; ++k) {
      if (itemFilter(filter, jsonItems[k])) { filtered.push(jsonItems[k]); }
    }
    return filtered;
  }; // end filterJson(jsonItems, filter)

  /**
   * getObjectsJson
   * @param {*} obj
   * @param {*} key
   * @param {*} val
   * @returns an array of objects according to key, value, or key and value matching
   * example getObjectsJson(jsonObj,'stars','99')) returns 1 object where a key names ID has the value Awesome
   */
  const getObjectsJson = (obj, key, val) => {
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] === 'object') {
        objects = objects.concat(getObjectsJson(obj[i], key, val));
      } else if ((i === key && obj[i] === val) || (i === key && val === '')) {
        objects.push(obj);
      } else if ((obj[i] === val) && (key === '')) {
        if (objects.lastIndexOf(obj) === -1) {
          objects.push(obj);
        }
      }
    }
    return objects;
  };

  /**
   * getValuesJson
   * @param {*} obj
   * @param {*} key
   * @returns an array of values that match on a certain key
   * example getValuesJson(js,'ID') returns array ["redux", "vue"]
   */
  const getValuesJson = (obj, key) => {
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] === 'object') {
        objects = objects.concat(getValuesJson(obj[i], key));
      } else if (i === key) {
        objects.push(obj[i]);
      }
    }
    return objects;
  };

  /**
   * getKeysJson
   * @param {*} obj
   * @param {*} val
   * @returns an array of keys that match on a certain value
   * example getKeysJson(js,'ID') returns array ["javascript", "stars"]
   */
  const getKeysJson = (obj, val) => {
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] === 'object') {
        objects = objects.concat(getKeysJson(obj[i], val));
      } else if (obj[i] === val) {
        objects.push(i);
      }
    }
    return objects;
  };

  /**
   * getSortJson
   * Function to sort alphabetically an array of objects by some specific key.
   * @param {string} property Key of the object to sort.
   * @returns sorted json
   */
  const getSortJson = (property) => {
    var sortOrder = 1;

    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {
      if (sortOrder === -1) {
        return b[property].localeCompare(a[property]);
      }
      return a[property].localeCompare(b[property]);
    };
  };

  /**
   * xmlToJson
   * tries to parse a json like thing into real json
   * @param xml a xml like thing
   * @returns real json
   */
  const xmlToJson = (xml) => {
    let obj = {};

    if (xml.nodeType === 1) {
      if (xml.attributes.length > 0) {
        obj['@attributes'] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof (obj[nodeName]) === 'undefined') {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof (obj[nodeName].push) === 'undefined') {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };

  window.get = get;
  window.post = post;
  window.ajax = ajax;
  window.tryParseJson = tryParseJson;
  window.filterJson = filterJson;
  window.getObjectsJson = getObjectsJson;
  window.getValuesJson = getValuesJson;
  window.getKeysJson = getKeysJson;
  window.getSortJson = getSortJson;
})();
