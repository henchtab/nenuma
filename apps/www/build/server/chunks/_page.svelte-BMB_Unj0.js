import { q as getContext, g as attr, b as pop, p as push } from './index3-C3tkxEZ9.js';
import { l as logo } from './logo-C4vqx6Hq.js';
import './tma-DE_E59BU.js';
import { T as TON_CONNECT_UI_CONTEXT } from './constants-D2ZMuuf5.js';
import './utils2-CiK4tJ06.js';
import './index2-d8GdKNTl.js';
import './_sentry-release-injection-file-D10jjuQQ.js';
import '@ton/ton';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "2bfa1733-8ee4-49cb-af87-48a55323779c", e._sentryDebugIdIdentifier = "sentry-dbid-2bfa1733-8ee4-49cb-af87-48a55323779c");
  } catch (e2) {
  }
}();
function _page($$payload, $$props) {
  push();
  getContext(TON_CONNECT_UI_CONTEXT);
  $$payload.out += `<div class="container flex flex-col flex-1 items-center justify-center"><img${attr("src", logo)} alt="Nenuma logo" class="size-32"> <h1 class="text-3xl mt-10 font-bold">Welcome to Nenuma</h1> <p class="text-lg mt-4 text-ds-gray-900">Where your data is yours and yours alone.</p></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BMB_Unj0.js.map
