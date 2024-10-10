import { A as head } from './index3-C3tkxEZ9.js';
import { D as DataStreamAPI } from './DataStreamAPI-BxS5pbsy.js';
import { S as SubscriptionBatchAPI } from './SubscriptionBatchAPI-BnQbpE_Z.js';
import { S as SessionAPI } from './SessionAPI-CFH3wCyb.js';
import { S as SimpleSubscriberAPI } from './SimpleSubscriberAPI-DFsdKGWP.js';
import './_sentry-release-injection-file-Btn1PAw_.js';
import './utils2-CiK4tJ06.js';
import './index4-DsCIb9oO.js';
import './misc-DisFbBK1.js';
import './utils-CiLCLP5G.js';
import 'clsx';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import './constants-Bz-hBKcM.js';
import '@ton/ton';
import './tma-CErptf5t.js';
import 'tailwind-variants';
import './ton-connect-Ha9sPh3g.js';
import '@tonconnect/ui';
import './index5-BRx1imC1.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import './Output-Dj6-g0vZ.js';
import '@formkit/auto-animate';
import './Section2-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "34fcd73c-adad-473c-902f-90c2fa5c3b4e", e._sentryDebugIdIdentifier = "sentry-dbid-34fcd73c-adad-473c-902f-90c2fa5c3b4e");
  } catch (e2) {
  }
}();
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Streams API</title>`;
    $$payload2.out += `<meta name="description" content="Explore the Streams API to deploy data streams, manage subscriptions, and handle notifications on the blockchain.">`;
  });
  $$payload.out += `<!--[-->`;
  DataStreamAPI($$payload);
  $$payload.out += `<!--]--> <!--[-->`;
  SubscriptionBatchAPI($$payload);
  $$payload.out += `<!--]--> <!--[-->`;
  SessionAPI($$payload);
  $$payload.out += `<!--]--> <!--[-->`;
  SimpleSubscriberAPI($$payload);
  $$payload.out += `<!--]-->`;
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CI2gCR4A.js.map
