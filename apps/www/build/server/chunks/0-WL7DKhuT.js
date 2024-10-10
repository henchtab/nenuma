import { wrapLoadWithSentry } from '@sentry/sveltekit';
import 'posthog-js';
import './_sentry-release-injection-file-DnBzmPpn.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "d9393a95-9fb9-4a91-8cec-2be3df00498d", e._sentryDebugIdIdentifier = "sentry-dbid-d9393a95-9fb9-4a91-8cec-2be3df00498d");
  } catch (e2) {
  }
}();
const load$1 = async () => {
  return;
};
const load = load$1 ? wrapLoadWithSentry(load$1) : void 0;

var _layout_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-DdDyGsoM.js')).default;
const universal_id = "src/routes/+layout.ts";
const imports = ["_app/immutable/nodes/0.CKIl2GX0.js","_app/immutable/chunks/entry.BXM2iJQb.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/chunks/module.BC5swb0I.js","_app/immutable/chunks/exports.C2hOwL6d.js","_app/immutable/chunks/context.DgUR6jvu.js","_app/immutable/chunks/tma.rVQqEs2y.js","_app/immutable/chunks/disclose-version.D6EsJnYG.js","_app/immutable/chunks/index.DxEOhgvT.js","_app/immutable/chunks/this.BQt3S_WI.js","_app/immutable/chunks/snippet.1hvjHwzA.js","_app/immutable/chunks/store.DptLI-NC.js","_app/immutable/chunks/data.Y1Fv7qsY.js","_app/immutable/chunks/utils.YSFv-2po.js","_app/immutable/chunks/misc.CIUvn4wi.js","_app/immutable/chunks/props.DeK5Z2bj.js","_app/immutable/chunks/Icon.BnERphcc.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.CEVEthHX.js","_app/immutable/chunks/7.t5dMFPjj.js","_app/immutable/chunks/class.vb17iJ9k.js"];
const stylesheets = ["_app/immutable/assets/0.BPdHK6pb.css","_app/immutable/assets/Toaster.Dljj2rV8.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=0-WL7DKhuT.js.map
