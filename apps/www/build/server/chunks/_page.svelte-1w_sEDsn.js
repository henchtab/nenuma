import { A as head } from './index3-C3tkxEZ9.js';
import { B as BrokerageAPI } from './BrokerageAPI-DmUZdcdr.js';
import './index4-oP-Y0xSz.js';
import 'clsx';
import './constants-YcxnLy9M.js';
import './tma-DWgLwTMy.js';
import './_sentry-release-injection-file-DnBzmPpn.js';
import './index5-8CER8S0e.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import '@formkit/auto-animate';
import './utils2-CiK4tJ06.js';
import './utils-Cu53aTbv.js';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import './Section-4oNqorjo.js';
import './Output-B9sb5j8q.js';
import './misc-DisFbBK1.js';
import 'tailwind-variants';
import './ton-connect-Dy4dENFp.js';
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
//# sourceMappingURL=_page.svelte-1w_sEDsn.js.map
