import { p as push, t as copy_payload, w as assign_payload, b as pop, d as store_get, x as store_set, u as unsubscribe_stores } from './index3-C3tkxEZ9.js';
import { B as Button } from './index4-C3ooMKJa.js';
import { a as useBrokerageAccount, L as Label, I as Input } from './index5-CbGI2GMt.js';
import './_sentry-release-injection-file-B-U-aYmd.js';
import { a as formatOutputDate } from './utils-h3ohtT7M.js';
import { fromNano } from '@ton/core';
import { w as writable } from './index2-d8GdKNTl.js';
import { O as Output } from './Output-BEcvFXv2.js';
import { S as Section } from './Section-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "f7ea7179-0617-4958-a34e-605c01563bc1", e._sentryDebugIdIdentifier = "sentry-dbid-f7ea7179-0617-4958-a34e-605c01563bc1");
  } catch (e2) {
  }
}();
function BrokerageAccountAPI($$payload, $$props) {
  push();
  var $$store_subs;
  const brokerageAddress = writable("");
  const brokerageAccount = useBrokerageAccount(brokerageAddress);
  let output = [];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Section($$payload2, {
      title: "Brokerage Account",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Label($$payload3, {
          class: "grid gap-2 mt-4",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Brokerage Address <!--[-->`;
            Input($$payload4, {
              type: "text",
              placeholder: "0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj",
              class: "w-fit",
              get value() {
                return store_get($$store_subs ??= {}, "$brokerageAddress", brokerageAddress);
              },
              set value($$value) {
                store_set(brokerageAddress, $$value);
                $$settled = false;
              }
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <p class="mt-3 mb-8 text-ds-gray-900 max-w-[640px]">Sets up and manages brokerage accounts. Initializes with brokerage and trader addresses, ensures
    the sender is authorized, and notifies deployment success. Tracks storage reserves and handles
    account-related requests while validating access.</p> <div class="flex gap-4 items-end overflow-x-auto snap-x snap-mandatory"><!--[-->`;
        Button($$payload3, {
          class: "bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$brokerageAccount", brokerageAccount).getBrokerage();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Brokerage`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$brokerageAccount", brokerageAccount).getTrader();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Trader`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$brokerageAccount", brokerageAccount).getStorageReserve();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Storage Reserve`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></div> <!--[-->`;
        Output($$payload3, {
          get output() {
            return output;
          },
          set output($$value) {
            output = $$value;
            $$settled = false;
          }
        });
        $$payload3.out += `<!--]-->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { BrokerageAccountAPI as B };
//# sourceMappingURL=BrokerageAccountAPI-CBZEnEPv.js.map
