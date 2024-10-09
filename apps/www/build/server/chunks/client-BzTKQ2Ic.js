import './index-DmRbVFTk.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "b9a7e9da-3552-4555-b8c4-234e8b5488e9", e._sentryDebugIdIdentifier = "sentry-dbid-b9a7e9da-3552-4555-b8c4-234e8b5488e9");
  } catch (e2) {
  }
}();
function get(key, parse = JSON.parse) {
  try {
    return parse(sessionStorage[key]);
  } catch {
  }
}
const SNAPSHOT_KEY = "sveltekit:snapshot";
const SCROLL_KEY = "sveltekit:scroll";
get(SCROLL_KEY) ?? {};
get(SNAPSHOT_KEY) ?? {};
//# sourceMappingURL=client-BzTKQ2Ic.js.map
