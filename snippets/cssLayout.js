// cssLayout.js
// tiny CSS layout "debugger" puts random color border around each element
[].forEach.call($$('*'),
  function (a) {
    a.style.outline = '1px solid #' + (~~(Math.random() * (1 << 24))).toString(16);
  });
