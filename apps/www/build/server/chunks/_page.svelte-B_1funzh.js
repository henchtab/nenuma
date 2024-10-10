import { A as head } from './index3-C3tkxEZ9.js';
import { B as BrokerageAPI } from './BrokerageAPI-NFMsbNaV.js';
import { B as BrokerAPI } from './BrokerAPI-BIZdQIAO.js';
import { B as BrokerageAccountAPI } from './BrokerageAccountAPI-ZBuSpZQ6.js';
import { C as CashOrNothingAPI } from './CashOrNothingAPI-BIEIIsvb.js';
import './_sentry-release-injection-file-D10jjuQQ.js';
import './utils2-CiK4tJ06.js';
import './utils-D1S0724n.js';
import 'clsx';
import './index2-d8GdKNTl.js';
import 'tailwind-merge';
import './constants-D2ZMuuf5.js';
import '@ton/ton';
import './tma-DE_E59BU.js';
import './index4-BlIEbkCH.js';
import './misc-DisFbBK1.js';
import 'tailwind-variants';
import './ton-connect-DdpIiAEw.js';
import '@tonconnect/ui';
import './index5-DdGzW48b.js';
import '@ton/core';
import './Section-4oNqorjo.js';
import './Output-B30zo6Pi.js';
import '@formkit/auto-animate';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "37c15e91-9fed-45f3-9a2b-9a3f0a700363", e._sentryDebugIdIdentifier = "sentry-dbid-37c15e91-9fed-45f3-9a2b-9a3f0a700363");
  } catch (e2) {
  }
}();
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Options API</title>`;
    $$payload2.out += `<meta name="description" content="Setup: Initializes with an owner and a storage reserve. Brokers and Accounts: Can deploy new brokers and brokerage accounts, each associated with specific addresses. Deposits: Ensures adequate deposits for various actions. Notifications: Sends confirmations and success messages back to the owner or relevant parties. The contract includes functions to get storage reserve, owner, and addresses for brokers and accounts, and manages deployment and communication between entities.">`;
  });
  $$payload.out += `<div><div class="py-6 border-b"><h1 class="text-ds-gray-1000 container font-semibold text-3xl text-left">Options API</h1></div> <!--[-->`;
  BrokerageAPI($$payload);
  $$payload.out += `<!--]--> <!--[-->`;
  BrokerAPI($$payload);
  $$payload.out += `<!--]--> <!--[-->`;
  BrokerageAccountAPI($$payload);
  $$payload.out += `<!--]--> <!--[-->`;
  CashOrNothingAPI($$payload);
  $$payload.out += `<!--]--></div>`;
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B_1funzh.js.map
