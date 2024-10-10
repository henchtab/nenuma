import { A as head } from './index3-C3tkxEZ9.js';
import { D as DataStreamAPI } from './DataStreamAPI-B0ajM7rd.js';
import { S as SubscriptionBatchAPI } from './SubscriptionBatchAPI-KjnW3Ogw.js';
import { S as SessionAPI } from './SessionAPI-DLVY7bZT.js';
import { S as SimpleSubscriberAPI } from './SimpleSubscriberAPI-CfzU4_xG.js';
import './_sentry-release-injection-file-D10jjuQQ.js';
import './utils2-CiK4tJ06.js';
import './index4-BlIEbkCH.js';
import './misc-DisFbBK1.js';
import './utils-D1S0724n.js';
import 'clsx';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import './constants-D2ZMuuf5.js';
import '@ton/ton';
import './tma-DE_E59BU.js';
import 'tailwind-variants';
import './ton-connect-DdpIiAEw.js';
import '@tonconnect/ui';
import './index5-DdGzW48b.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import './Output-B30zo6Pi.js';
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
//# sourceMappingURL=_page.svelte-BkH2SjqE.js.map
