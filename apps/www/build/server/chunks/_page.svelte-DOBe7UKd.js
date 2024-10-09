import { A as head } from './index3-C3tkxEZ9.js';
import { B as BrokerageAPI } from './BrokerageAPI-gGsrpmNi.js';
import './index4-C3ooMKJa.js';
import 'clsx';
import './constants-u-0RYjcS.js';
import './tma-CBfk33he.js';
import './_sentry-release-injection-file-B-U-aYmd.js';
import './index5-CbGI2GMt.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import '@formkit/auto-animate';
import './utils2-CiK4tJ06.js';
import './utils-h3ohtT7M.js';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import './Section-4oNqorjo.js';
import './Output-BEcvFXv2.js';
import './misc-DisFbBK1.js';
import 'tailwind-variants';
import './ton-connect-B_eqdS4i.js';
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
//# sourceMappingURL=_page.svelte-DOBe7UKd.js.map
