import { A as head } from './index3-C3tkxEZ9.js';
import { B as BrokerageAPI } from './BrokerageAPI-NFMsbNaV.js';
import './index4-BlIEbkCH.js';
import 'clsx';
import './constants-D2ZMuuf5.js';
import './tma-DE_E59BU.js';
import './_sentry-release-injection-file-D10jjuQQ.js';
import './index5-DdGzW48b.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import '@formkit/auto-animate';
import './utils2-CiK4tJ06.js';
import './utils-D1S0724n.js';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import './Section-4oNqorjo.js';
import './Output-B30zo6Pi.js';
import './misc-DisFbBK1.js';
import 'tailwind-variants';
import './ton-connect-DdpIiAEw.js';
import '@tonconnect/ui';
import '@ton/ton';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "04c10001-7d3b-4e33-a865-5d8ac85664a9", e._sentryDebugIdIdentifier = "sentry-dbid-04c10001-7d3b-4e33-a865-5d8ac85664a9");
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
//# sourceMappingURL=_page.svelte-BoX4D-th.js.map
