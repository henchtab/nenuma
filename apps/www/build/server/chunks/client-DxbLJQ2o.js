import './index-DmRbVFTk.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "89f5ac0c-7c03-4f4b-981d-da0b80987f55", e._sentryDebugIdIdentifier = "sentry-dbid-89f5ac0c-7c03-4f4b-981d-da0b80987f55");
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
//# sourceMappingURL=client-DxbLJQ2o.js.map
