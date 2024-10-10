import { n as escape_html, d as store_get, u as unsubscribe_stores, b as pop, l as spread_props, p as push, i as slot, o as sanitize_props } from './index3-C3tkxEZ9.js';
import { I as Icon } from './Icon-DC-Mh-BG.js';
import { d as default_slot } from './misc-DisFbBK1.js';
import { p as page } from './stores-BmSZLopb.js';
import './utils2-CiK4tJ06.js';
import './client-DxbLJQ2o.js';
import './index-DmRbVFTk.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "cc3b44bd-c343-4010-9535-d328651280d7", e._sentryDebugIdIdentifier = "sentry-dbid-cc3b44bd-c343-4010-9535-d328651280d7");
  } catch (e2) {
  }
}();
function Octagon_alert($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 16h.01" }],
    ["path", { "d": "M12 8v4" }],
    [
      "path",
      {
        "d": "M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"
      }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "octagon-alert" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `<!--[-->`;
        slot($$payload2, default_slot($$props), {}, null);
        $$payload2.out += `<!--]-->`;
      },
      $$slots: { default: true }
    }
  ]));
  $$payload.out += `<!--]-->`;
}
function _error($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<div class="container py-10"><!--[-->`;
  Octagon_alert($$payload, {
    class: "text-ds-red-900",
    strokeWidth: 1.5,
    size: "64"
  });
  $$payload.out += `<!--]--> <h1 class="text-3xl text-ds-red-900 mt-3">Oh no!</h1> <p class="text-ds-red-900 text-lg mt-2">${escape_html(store_get($$store_subs ??= {}, "$page", page).error?.message)}</p></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _error as default };
//# sourceMappingURL=_error.svelte-BVaa6a7D.js.map
