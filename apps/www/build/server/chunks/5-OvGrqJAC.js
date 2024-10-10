import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { r as redirect } from './index-DFCTwyZH.js';
import './_sentry-release-injection-file-DnBzmPpn.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "6c830946-cc14-4f21-9429-97d56ab31033", e._sentryDebugIdIdentifier = "sentry-dbid-6c830946-cc14-4f21-9429-97d56ab31033");
  } catch (e2) {
  }
}();
const load$1 = async ({}) => {
  return redirect(307, "/dashboard/BTCUSDT");
};
const load = load$1 ? wrapServerLoadWithSentry(load$1) : void 0;

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
const server_id = "src/routes/(app)/dashboard/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-OvGrqJAC.js.map
