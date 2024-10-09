import { A as head } from './index3-C3tkxEZ9.js';
import 'clsx';
import './constants-u-0RYjcS.js';
import './tma-CBfk33he.js';
import './_sentry-release-injection-file-B-U-aYmd.js';
import './index4-C3ooMKJa.js';
import './index5-CbGI2GMt.js';
import '@ton/core';
import '@formkit/auto-animate';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import { B as BrokerageAccountAPI } from './BrokerageAccountAPI-CBZEnEPv.js';
import './utils2-CiK4tJ06.js';
import '@ton/ton';
import './index2-d8GdKNTl.js';
import './misc-DisFbBK1.js';
import './utils-h3ohtT7M.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './ton-connect-B_eqdS4i.js';
import '@tonconnect/ui';
import './Output-BEcvFXv2.js';
import './Section-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "caf68bfb-070b-4800-8ded-5e302e05c8d9", e._sentryDebugIdIdentifier = "sentry-dbid-caf68bfb-070b-4800-8ded-5e302e05c8d9");
  } catch (e2) {
  }
}();
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Brokerage Account API</title>`;
  });
  $$payload.out += `<!--[-->`;
  BrokerageAccountAPI($$payload);
  $$payload.out += `<!--]-->`;
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D0yG6_Rg.js.map
