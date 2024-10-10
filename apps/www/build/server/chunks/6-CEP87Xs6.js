import { wrapLoadWithSentry, wrapServerLoadWithSentry } from '@sentry/sveltekit';
import { P as PUBLIC_API_URL } from './public-BCOIycai.js';
import { t as timeToLocal } from './utils-D1S0724n.js';
import { e as error } from './index-DFCTwyZH.js';
import './_sentry-release-injection-file-D10jjuQQ.js';
import { A as ACCESS_TOKEN_COOKIE } from './constants-D2ZMuuf5.js';
import 'clsx';
import './index2-d8GdKNTl.js';
import './utils2-CiK4tJ06.js';
import 'tailwind-merge';
import './tma-DE_E59BU.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-DfQ-BPF3.js')).default;
const universal_id = "src/routes/(app)/dashboard/[topic]/+page.ts";
const server_id = "src/routes/(app)/dashboard/[topic]/+page.server.ts";
const imports = ["_app/immutable/nodes/6.k9ihrXpU.js","_app/immutable/chunks/entry.7HnUc9yS.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/chunks/module.BC5swb0I.js","_app/immutable/chunks/exports.C2hOwL6d.js","_app/immutable/chunks/context.CrttRzP-.js","_app/immutable/chunks/utils.DKZFuNm_.js","_app/immutable/chunks/index.DxEOhgvT.js","_app/immutable/chunks/tma.DBwO2EMO.js","_app/immutable/chunks/disclose-version.u5Z3pXpL.js","_app/immutable/chunks/store.CGJjtedz.js","_app/immutable/chunks/index.BGUkzaut.js","_app/immutable/chunks/misc.mxP9ZKAE.js","_app/immutable/chunks/props.DeK5Z2bj.js","_app/immutable/chunks/this.BkV_1EO3.js","_app/immutable/chunks/shorten-address.D43lzPHj.js","_app/immutable/chunks/trending-up.DAzIyyD8.js","_app/immutable/chunks/Icon.CwGfoLqs.js","_app/immutable/chunks/updater.CFJRBzzH.js","_app/immutable/chunks/stores.Df-hYigX.js","_app/immutable/chunks/ws.svelte.r0yWGkU9.js","_app/immutable/chunks/class.tuH2k2wO.js","_app/immutable/chunks/index.BFv1cshu.js","_app/immutable/chunks/utils.C-_dn_i0.js","_app/immutable/chunks/snippet.1hvjHwzA.js","_app/immutable/chunks/with-wallet-connection.BURcSADC.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=6-CEP87Xs6.js.map
