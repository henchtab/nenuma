import { A as head } from './index3-C3tkxEZ9.js';
import 'clsx';
import './constants-BJLYdDiK.js';
import './tma-CaNIkir8.js';
import './_sentry-release-injection-file-DHom2vTX.js';
import './index4-Bx_7Dk7S.js';
import './index5-DiRIAbbA.js';
import '@ton/core';
import '@formkit/auto-animate';
import { B as BrokerAPI } from './BrokerAPI-Byri148V.js';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import './utils2-CiK4tJ06.js';
import '@ton/ton';
import './index2-d8GdKNTl.js';
import './misc-DisFbBK1.js';
import './utils-D4QS32x_.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './ton-connect-B099bpYZ.js';
import '@tonconnect/ui';
import './Output-D-Q6WW_G.js';
import './Section-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "2279c79d-7167-4ed6-b2be-b059d142eb6d", e._sentryDebugIdIdentifier = "sentry-dbid-2279c79d-7167-4ed6-b2be-b059d142eb6d");
  } catch (e2) {
  }
}();
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Broker API</title>`;
  });
  $$payload.out += `<!--[-->`;
  BrokerAPI($$payload);
  $$payload.out += `<!--]-->`;
}

export { _page as default };
//# sourceMappingURL=_page.svelte-OHSKECvI.js.map
