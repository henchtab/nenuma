import { A as head } from './index3-C3tkxEZ9.js';
import './index4-oP-Y0xSz.js';
import 'clsx';
import './constants-YcxnLy9M.js';
import './tma-DWgLwTMy.js';
import './_sentry-release-injection-file-DnBzmPpn.js';
import './index5-8CER8S0e.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import '@formkit/auto-animate';
import { S as SessionAPI } from './SessionAPI-DY5K9BhH.js';
import './utils2-CiK4tJ06.js';
import './misc-DisFbBK1.js';
import './utils-Cu53aTbv.js';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './ton-connect-Dy4dENFp.js';
import '@tonconnect/ui';
import '@ton/ton';
import './Output-B9sb5j8q.js';
import './Section2-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "b6997308-2055-44da-9e32-f6d78b35bba9", e._sentryDebugIdIdentifier = "sentry-dbid-b6997308-2055-44da-9e32-f6d78b35bba9");
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
//# sourceMappingURL=_page.svelte-B-5GXVSK.js.map
