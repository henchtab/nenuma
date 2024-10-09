!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "24d6083d-fd69-4ca1-b8ac-a574e5074588", e._sentryDebugIdIdentifier = "sentry-dbid-24d6083d-fd69-4ca1-b8ac-a574e5074588");
  } catch (e2) {
  }
}();
function default_slot($$props) {
  var children = $$props.$$slots?.default;
  if (children === true) {
    return $$props.children;
  } else {
    return children;
  }
}

export { default_slot as d };
//# sourceMappingURL=misc-DisFbBK1.js.map
