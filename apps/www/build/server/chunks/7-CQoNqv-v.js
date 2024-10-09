import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { r as redirect } from './index-DFCTwyZH.js';
import './_sentry-release-injection-file-B-U-aYmd.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "b13b1c79-d94b-412d-8f1b-139e049a288c", e._sentryDebugIdIdentifier = "sentry-dbid-b13b1c79-d94b-412d-8f1b-139e049a288c");
  } catch (e2) {
  }
}();
const load$1 = async () => {
  redirect(307, "/playground/streams-api/data-stream");
};
const load = load$1 ? wrapServerLoadWithSentry(load$1) : void 0;

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 7;
const server_id = "src/routes/playground/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-CQoNqv-v.js.map
