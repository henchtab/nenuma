import { A as head } from './index3-C3tkxEZ9.js';
import 'clsx';
import './constants-YcxnLy9M.js';
import './tma-DWgLwTMy.js';
import './_sentry-release-injection-file-DnBzmPpn.js';
import './index4-oP-Y0xSz.js';
import './index5-8CER8S0e.js';
import '@ton/core';
import '@formkit/auto-animate';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import { C as CashOrNothingAPI } from './CashOrNothingAPI-yHz0lTpS.js';
import './utils2-CiK4tJ06.js';
import '@ton/ton';
import './index2-d8GdKNTl.js';
import './misc-DisFbBK1.js';
import './utils-Cu53aTbv.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './ton-connect-Dy4dENFp.js';
import '@tonconnect/ui';
import './Output-B9sb5j8q.js';
import './Section-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "16c6b60a-a011-46b1-b14d-541bf7ff5e7c", e._sentryDebugIdIdentifier = "sentry-dbid-16c6b60a-a011-46b1-b14d-541bf7ff5e7c");
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
//# sourceMappingURL=_page.svelte-Bbs8xeOR.js.map
