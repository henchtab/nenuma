import { A as head } from './index3-C3tkxEZ9.js';
import { B as BrokerageAPI } from './BrokerageAPI-zOjGMbbf.js';
import './index4-Bx_7Dk7S.js';
import 'clsx';
import './constants-BJLYdDiK.js';
import './tma-CaNIkir8.js';
import './_sentry-release-injection-file-DHom2vTX.js';
import './index5-DiRIAbbA.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import '@formkit/auto-animate';
import './utils2-CiK4tJ06.js';
import './utils-D4QS32x_.js';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import './Section-4oNqorjo.js';
import './Output-D-Q6WW_G.js';
import './misc-DisFbBK1.js';
import 'tailwind-variants';
import './ton-connect-B099bpYZ.js';
import '@tonconnect/ui';
import '@ton/ton';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "a1634f5a-8fbb-4d88-84db-f2d8cc8d72c7", e._sentryDebugIdIdentifier = "sentry-dbid-a1634f5a-8fbb-4d88-84db-f2d8cc8d72c7");
  } catch (e2) {
  }
}();
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Brokerage API</title>`;
  });
  $$payload.out += `<!--[-->`;
  BrokerageAPI($$payload);
  $$payload.out += `<!--]-->`;
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BsELKA6V.js.map
