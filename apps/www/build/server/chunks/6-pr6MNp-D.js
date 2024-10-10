import { wrapLoadWithSentry, wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { P as PUBLIC_API_URL } from './public-BbnfBXYT.js';
import { t as timeToLocal } from './utils-CiLCLP5G.js';
import { e as error } from './index-DFCTwyZH.js';
import './_sentry-release-injection-file-Btn1PAw_.js';
import { A as ACCESS_TOKEN_COOKIE } from './constants-Bz-hBKcM.js';
import 'clsx';
import './index2-d8GdKNTl.js';
import './utils2-CiK4tJ06.js';
import 'tailwind-merge';
import './tma-CErptf5t.js';
import '@ton/ton';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "aa6b8c85-d4ed-477b-9ce0-5e655dd94ec8", e._sentryDebugIdIdentifier = "sentry-dbid-aa6b8c85-d4ed-477b-9ce0-5e655dd94ec8");
  } catch (e2) {
  }
}();
const load$1$1 = async ({ fetch, params, data }) => {
  const topic = params.topic;
  const res = await fetch(`${PUBLIC_API_URL}/api/kline/${topic}`);
  const result = await res.json();
  try {
    result.list.forEach((item) => {
      item.time = timeToLocal(item.time);
    });
    result.latest.time = timeToLocal(result.latest.time);
    return {
      topic,
      result
    };
  } catch (e) {
    error(
      500,
      "Something went wrong! We are already notified about this issue. Please try again later."
    );
  }
};
const load$2 = load$1$1 ? wrapLoadWithSentry(load$1$1) : void 0;

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load$2
});

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "19bcbdc5-9231-4c9d-aac9-3fba73c1b856", e._sentryDebugIdIdentifier = "sentry-dbid-19bcbdc5-9231-4c9d-aac9-3fba73c1b856");
  } catch (e2) {
  }
}();
const load$1 = async ({ cookies }) => {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE);
  return {
    accessToken
  };
};
const load = load$1 ? wrapServerLoadWithSentry(load$1) : void 0;

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-NoZ4CTp2.js')).default;
const universal_id = "src/routes/(app)/dashboard/[topic]/+page.ts";
const server_id = "src/routes/(app)/dashboard/[topic]/+page.server.ts";
const imports = ["_app/immutable/nodes/6.C14fxeXZ.js","_app/immutable/chunks/entry.Ckzyi5uj.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/chunks/module.BC5swb0I.js","_app/immutable/chunks/exports.C2hOwL6d.js","_app/immutable/chunks/context.DgUR6jvu.js","_app/immutable/chunks/utils.Ddqmgtfs.js","_app/immutable/chunks/index.DxEOhgvT.js","_app/immutable/chunks/tma.h_RQhYAu.js","_app/immutable/chunks/disclose-version.BX9sjkWX.js","_app/immutable/chunks/store.bP1OfJqg.js","_app/immutable/chunks/index.DDlW02wl.js","_app/immutable/chunks/misc.BWlwX1mb.js","_app/immutable/chunks/props.DeK5Z2bj.js","_app/immutable/chunks/this.BAuJCPR5.js","_app/immutable/chunks/shorten-address.Dpv2JgCw.js","_app/immutable/chunks/trending-up.BHqEKa5l.js","_app/immutable/chunks/Icon.DogXymF_.js","_app/immutable/chunks/updater.CAeDVzaF.js","_app/immutable/chunks/stores.CflhKAit.js","_app/immutable/chunks/ws.svelte.sfSugZ_m.js","_app/immutable/chunks/class.CdE19dnz.js","_app/immutable/chunks/index.Do2oo2WQ.js","_app/immutable/chunks/utils.CJz03O75.js","_app/immutable/chunks/snippet.1hvjHwzA.js","_app/immutable/chunks/with-wallet-connection.WdMeXV8N.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=6-pr6MNp-D.js.map
