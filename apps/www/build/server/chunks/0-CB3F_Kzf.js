import { wrapLoadWithSentry } from '@sentry/sveltekit';
import 'posthog-js';
import './_sentry-release-injection-file-Btn1PAw_.js';

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
const component = async () => component_cache ??= (await import('./_layout.svelte-622zueqV.js')).default;
const universal_id = "src/routes/+layout.ts";
const imports = ["_app/immutable/nodes/0.BLIoUABq.js","_app/immutable/chunks/entry.Ckzyi5uj.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/chunks/module.BC5swb0I.js","_app/immutable/chunks/exports.C2hOwL6d.js","_app/immutable/chunks/context.DgUR6jvu.js","_app/immutable/chunks/tma.h_RQhYAu.js","_app/immutable/chunks/disclose-version.BX9sjkWX.js","_app/immutable/chunks/index.DxEOhgvT.js","_app/immutable/chunks/this.BAuJCPR5.js","_app/immutable/chunks/snippet.1hvjHwzA.js","_app/immutable/chunks/store.bP1OfJqg.js","_app/immutable/chunks/data.CWwHbr-3.js","_app/immutable/chunks/utils.Ddqmgtfs.js","_app/immutable/chunks/misc.BWlwX1mb.js","_app/immutable/chunks/props.DeK5Z2bj.js","_app/immutable/chunks/Icon.DogXymF_.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.CEVEthHX.js","_app/immutable/chunks/7.CcN33h4F.js","_app/immutable/chunks/class.CdE19dnz.js"];
const stylesheets = ["_app/immutable/assets/0.BPdHK6pb.css","_app/immutable/assets/Toaster.Dljj2rV8.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=0-CB3F_Kzf.js.map
