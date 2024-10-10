import { A as head } from './index3-C3tkxEZ9.js';
import './index4-DsCIb9oO.js';
import 'clsx';
import './constants-Bz-hBKcM.js';
import './tma-CErptf5t.js';
import './_sentry-release-injection-file-Btn1PAw_.js';
import './index5-BRx1imC1.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import '@formkit/auto-animate';
import { S as SessionAPI } from './SessionAPI-CFH3wCyb.js';
import './utils2-CiK4tJ06.js';
import './misc-DisFbBK1.js';
import './utils-CiLCLP5G.js';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './ton-connect-Ha9sPh3g.js';
import '@tonconnect/ui';
import '@ton/ton';
import './Output-Dj6-g0vZ.js';
import './Section2-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "14115613-6f87-4517-93a0-d97058e0432d", e._sentryDebugIdIdentifier = "sentry-dbid-14115613-6f87-4517-93a0-d97058e0432d");
  } catch (e2) {
  }
}();
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Session API</title>`;
  });
  $$payload.out += `<!--[-->`;
  SessionAPI($$payload);
  $$payload.out += `<!--]-->`;
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B2N8e6St.js.map
