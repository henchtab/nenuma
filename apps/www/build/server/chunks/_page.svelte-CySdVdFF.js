import { A as head } from './index3-C3tkxEZ9.js';
import 'clsx';
import './constants-Bz-hBKcM.js';
import './tma-CErptf5t.js';
import './_sentry-release-injection-file-Btn1PAw_.js';
import './index4-DsCIb9oO.js';
import './index5-BRx1imC1.js';
import '@ton/core';
import '@formkit/auto-animate';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import { C as CashOrNothingAPI } from './CashOrNothingAPI-DhPg6eiH.js';
import './utils2-CiK4tJ06.js';
import '@ton/ton';
import './index2-d8GdKNTl.js';
import './misc-DisFbBK1.js';
import './utils-CiLCLP5G.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './ton-connect-Ha9sPh3g.js';
import '@tonconnect/ui';
import './Output-Dj6-g0vZ.js';
import './Section-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "fb9d6aa6-deeb-4822-9edd-f1c28e0c8af4", e._sentryDebugIdIdentifier = "sentry-dbid-fb9d6aa6-deeb-4822-9edd-f1c28e0c8af4");
  } catch (e2) {
  }
}();
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Cash or Nothing Option API</title>`;
  });
  $$payload.out += `<!--[-->`;
  CashOrNothingAPI($$payload);
  $$payload.out += `<!--]-->`;
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CySdVdFF.js.map
