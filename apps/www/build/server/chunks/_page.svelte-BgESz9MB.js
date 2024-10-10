import { A as head } from './index3-C3tkxEZ9.js';
import { B as BrokerageAPI } from './BrokerageAPI-EQvc0cUq.js';
import './index4-DsCIb9oO.js';
import 'clsx';
import './constants-Bz-hBKcM.js';
import './tma-CErptf5t.js';
import './_sentry-release-injection-file-Btn1PAw_.js';
import './index5-BRx1imC1.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import '@formkit/auto-animate';
import './utils2-CiK4tJ06.js';
import './utils-CiLCLP5G.js';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import './Section-4oNqorjo.js';
import './Output-Dj6-g0vZ.js';
import './misc-DisFbBK1.js';
import 'tailwind-variants';
import './ton-connect-Ha9sPh3g.js';
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
//# sourceMappingURL=_page.svelte-BgESz9MB.js.map
