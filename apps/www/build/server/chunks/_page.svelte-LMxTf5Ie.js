import { A as head } from './index3-C3tkxEZ9.js';
import 'clsx';
import './constants-D2ZMuuf5.js';
import './tma-DE_E59BU.js';
import './_sentry-release-injection-file-D10jjuQQ.js';
import './index4-BlIEbkCH.js';
import './index5-DdGzW48b.js';
import '@ton/core';
import '@formkit/auto-animate';
import { B as BrokerAPI } from './BrokerAPI-BIZdQIAO.js';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import './utils2-CiK4tJ06.js';
import '@ton/ton';
import './index2-d8GdKNTl.js';
import './misc-DisFbBK1.js';
import './utils-D1S0724n.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './ton-connect-DdpIiAEw.js';
import '@tonconnect/ui';
import './Output-B30zo6Pi.js';
import './Section-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "6dc5c774-a816-4d13-93b2-474f702b8a69", e._sentryDebugIdIdentifier = "sentry-dbid-6dc5c774-a816-4d13-93b2-474f702b8a69");
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
//# sourceMappingURL=_page.svelte-LMxTf5Ie.js.map
