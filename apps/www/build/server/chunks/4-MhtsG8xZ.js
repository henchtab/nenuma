import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { r as redirect } from './index-DFCTwyZH.js';
import { R as REDIRECT_URL_COOKIE } from './constants-Bz-hBKcM.js';
import './_sentry-release-injection-file-Btn1PAw_.js';
import '@ton/ton';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "6e77cb93-4417-45c5-92d0-852bd246a4b2", e._sentryDebugIdIdentifier = "sentry-dbid-6e77cb93-4417-45c5-92d0-852bd246a4b2");
  } catch (e2) {
  }
}();
const load$1 = async ({ url, cookies }) => {
  const redirectUrl = url.searchParams.get("redirectUrl") || "/dashboard";
  cookies.set(REDIRECT_URL_COOKIE, redirectUrl, {
    path: "/",
    secure: false,
    httpOnly: false
  });
  redirect(307, redirectUrl);
};
const load = load$1 ? wrapServerLoadWithSentry(load$1) : void 0;

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-8zX5d05P.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/4.wGGNfrEH.js","_app/immutable/chunks/disclose-version.BX9sjkWX.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/chunks/store.bP1OfJqg.js","_app/immutable/chunks/logo.4Sxj4mRe.js","_app/immutable/chunks/tma.h_RQhYAu.js","_app/immutable/chunks/index.DxEOhgvT.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-MhtsG8xZ.js.map
