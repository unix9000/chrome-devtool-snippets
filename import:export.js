'use strict';
// Manage and Import / Export snippets from chrome (2018)
// hacked by: https://github.com/MarcelRittershaus/chromeDevToolsCodeSnippets

(() => {
  let_us('execute some init tests', () => {
    if (location.origin !== 'chrome-devtools://devtools') throw Error('not in devtools of devtools / please inspect devtools again (ctrl+shift+i)');
    ok(location.origin === 'chrome-devtools://devtools', 'we are in devtools of devtools.');
  });

  const state = {
    scriptSnippets: []
  };
  window.state = state;

  const style = `
  <style>
    body{
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    #drop_files {
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    dropzone {
      cursor: pointer;
      background-color: #222;
      color: #fff;
      font-weight: 300;
      font-size: 1em;
      text-align: center;
    }

    dropzone{
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
    }

    .state {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 200px;
      height: 90vh;
      list-style: none;
      padding: 3px 7px;
      margin: 5px;
      color: #fff;
    }

    .btns {
      position: absolute;
      bottom: 10px;
      left: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      algin-content: center;
      width: 300px;
      max-width: 300px;
      height: 300px;
    }



    button {
      display:flex
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: center;
      algin-content: center;
      text-algin: center;
      width: 140px;
      height: 140px;
      min-width: 140px;
      min-height: 140px;
      margin: 5px;
      color: #fff;
      border: 1px solid #fff;
      background-color: transparent;
      cursor: pointer;
    }

    button:hover {
      color: #222;
      border: 1px solid #fff;
      background-color: #fff;
    }
  </style>
  `;

  const markup = `
    <dropzone>
      <div>drop/select .js-file(s)</div>
      <input id="drop_files" type='file' multiple='true'/>
    </dropzone>

    <ul class="state" id="state.scriptSnippets"></ul>

    <div class="btns">
      <button id="save_snippets">save all</button>
      <button id="reset_snippets">delete all</button>
      <button id="export_snippets">export all</button>
      <button id="init">(re)init</button>
    </div>
  `;

  /* Main logic
  */
  const app_window = create_window('menubar=false, height=700, width=700', 'chrome snippets import/export');
  const document = app_window.document;

  let_us('bootstrap the whole thing', () => {
    init();
  });

  function init () {
    setupGUI();

    state.scriptSnippets = [];
    state.lastIdentifier = 0;
    state.gui_switches = {
      rename: false,
      format: 'js',
      review: false,
      append: true
    };

    InspectorFrontendHost.getPreferences(prefs => {
      const lastScriptSnippets = prefs.scriptSnippets;
      state.scriptSnippets = deserialize(lastScriptSnippets);
      state.lastIdentifier = prefs.scriptSnippets_lastIdentifier;
      update();
    });
  }

  function setupGUI () {
    app_window.document.body.innerHTML = style + markup;
    getID('drop_files').on('change', import_files);
    getID('export_snippets').on('click', export_snippets);
    getID('init').on('click', init);
    getID('save_snippets').on('click', save_snippets);
    getID('reset_snippets').on('click', reset_snippets);
  }

  function update () {
    render_list();
    console.log(state.gui_switches);
  }

  function render_list () {
    const ul = app_window.document.getElementById('state.scriptSnippets');
    ul.innerHTML = '';

    state.scriptSnippets.forEach((snippet) => {
      const li = document.createElement('li');
      li.innerHTML = snippet.name;
      ul.appendChild(li);
    });
  }

  /* Helpers
  */

  function import_files (event) {
    if (!state.gui_switches.append) state.scriptSnippets = [];

    const files = event.target.files;
    const stack = Object.keys(files)
      .forEach((key) => {
        const file = files[key];
        const reader = new FileReader();
        reader.fileName = file.name;
        reader.onerror = ()=> {throw Error};
        reader.onabort = ()=> {throw Error};
        reader.onload = file_loaded;
        reader.readAsText(file);
      });
  }

  function file_loaded (event) {
    const content_string = event.target.result;
    const fileName = event.target.fileName;
    const fileNameNoExt = /(.+?)(\.[^.]*$|$)/.exec(fileName)[1];
    const ext = /\.[0-9a-z]+$/.exec(fileName)[0];

    if (ext === '.json') return import_json(content_string);
    return add_snippet(fileNameNoExt, content_string);
  }

  function set_pref (name, data_string) {
    InspectorFrontendHost.setPreference(name, data_string);
  }

  function save_snippets () {
    set_pref('scriptSnippets', serialize(state.scriptSnippets));
    set_pref('scriptSnippets_lastIdentifier', state.lastIdentifier);
    prompt('restart chrome now!');
  }

  function reset_snippets () {
    var choice = window.confirm('DELETE ALL SNIPPETS IN DEVTOOLS?');
    if (choice) clear_chrome_snippets();
    init();
  }

  function clear_chrome_snippets () {
    set_pref('scriptSnippets', '[]');
    set_pref('scriptSnippets_lastIdentifier', '0');
  }

  function add_snippet (name, snippet_content_string) {
    if (is_duplicate(name, state.scriptSnippets)) {
      if (!state.gui_switches.rename) return state.scriptSnippets[name] = snippet_content_string;
      return add_snippet(name + 'copy', snippet_content_string);
    }

    const currentIdentifier = serialize(parseInt(state.lastIdentifier) + 1);
    const new_snip = {
      content: snippet_content_string,
      id: currentIdentifier,
      name: name
    };

    state.scriptSnippets.push(new_snip);
    state.lastIdentifier = currentIdentifier;
    update();
  }

  function export_snippets () {
    if (state.gui_switches.format === 'json') return download_json();
    return download_js();
  }

  function download_js () {
    state.scriptSnippets.forEach((snippet) => {
      download(snippet.name + '.js', snippet.content);
    });
  }

  function download_json () {
    console.log('json');
    const fileName = serialize(Date());
    const json_data = serialize({'snippets': state.scriptSnippets}, ['snippets', 'name', 'content'], 2);
    download(fileName + '.json', json_data);
  }

  /* util & shorthand
  */
  function request (url, success) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = success;
    xhr.send();
    return xhr;
  }

  function getID (id) {
    const element = app_window.document.getElementById(id);
    element.on = function on (event_name, fn) {
      this.addEventListener(event_name, fn);
      return this;
    };
    return element;
  }

  function serialize (object, ...rest) {
    if (!object) throw Error('serialize needs an object');
    return JSON.stringify(object, ...rest);
  }

  function deserialize (string) {
    if (typeof string !== 'string') throw Error('deserialize needs a string');
    if (string === '') throw Error('no snippets present');
    return JSON.parse(string);
  }

  function download (name, data) {
    const Blob = new window.Blob([data], {
      'type': 'text/utf-8'
    });
    const a = document.createElement('a');

    a.href = URL.createObjectURL(Blob);
    a.download = name;
    a.click();
  }

  function is_duplicate (name, snippets_arr) {
    const result = snippets_arr.filter(function (snippet) {
      return snippet.name === name;
    });

    if (result.length === 0) return false;
    return true;
  }

  function create_window (options, title) {
    const w = window.open('', '', options);
    w.document.title = title;
    return w;
  }

  /*
  * UNIT TESTS
  */
  let_us('write some tests', () => {
    // TODO
    // TDD tests are deleted now / remove harness
  });

  /* Nanoharness
  */
  function let_us (msg, f) {
    console.log('we_will: ' + msg);
    try { f(); } catch (exception) {
      console.warn(exception.stack.replace(/:(\d+):(\d+)/g, '$& (Line $1, Column $2)'));
    }
  }

  function ok (expr, msg) {
    log(expr, msg);
  }

  function log (expr, msg) {
    expr ? console.log('!pass ' + msg) : console.log('?fail ' + msg);
  }

  function html_log () {
    const queue = [];
    return function log (expr, msg) {
      queue.push(expr ? `!pass ${msg}` : `?fail ${msg}`);
    };
  }

})();
