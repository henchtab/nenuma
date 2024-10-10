import { p as push, t as copy_payload, w as assign_payload, b as pop, d as store_get, u as unsubscribe_stores } from './index3-C3tkxEZ9.js';
import { a as formatOutputDate } from './utils-D1S0724n.js';
import { B as Button } from './index4-BlIEbkCH.js';
import { c as createBrokerage, L as Label, I as Input } from './index5-DdGzW48b.js';
import './_sentry-release-injection-file-D10jjuQQ.js';
import { fromNano } from '@ton/core';
import { S as Section } from './Section-4oNqorjo.js';
import { O as Output } from './Output-B30zo6Pi.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "f3d0b8f2-a091-423d-adcf-7b1f7301bf59", e._sentryDebugIdIdentifier = "sentry-dbid-f3d0b8f2-a091-423d-adcf-7b1f7301bf59");
  } catch (e2) {
  }
}();
function BrokerageAPI($$payload, $$props) {
  push();
  var $$store_subs;
  const brokerage = createBrokerage();
  let output = [];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Section($$payload2, {
      title: "Brokerage",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<p class="mb-8 mt-4 text-ds-gray-900 max-w-[640px]">Initializes brokerage accounts with the owner's address. Handles broker and account deployments,
    ensuring sender authorization and required deposits. Retrieves associated broker and account
    addresses and notifies deployment success. Tracks storage reserves and manages contract
    interactions securely.</p> <div class="flex gap-4 items-end overflow-x-auto"><form class="flex flex-col gap-4 min-w-max"><!--[-->`;
        Label($$payload3, {
          class: "flex flex-col gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Query ID <!--[-->`;
            Input($$payload4, {
              type: "number",
              name: "queryId",
              placeholder: "777",
              required: true,
              min: "0"
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-green-800 text-white hover:bg-ds-green-700",
          type: "submit",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Deploy Brokerage`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <form class="flex flex-col gap-4 w-max"><!--[-->`;
        Label($$payload3, {
          class: "flex flex-col gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Stream Address <!--[-->`;
            Input($$payload4, {
              type: "text",
              name: "stream",
              placeholder: "0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV",
              required: true,
              min: "0"
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Label($$payload3, {
          class: "flex flex-col gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Query ID <!--[-->`;
            Input($$payload4, {
              type: "number",
              name: "queryId",
              placeholder: "777",
              required: true,
              min: "0"
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-green-800 text-white hover:bg-ds-green-700",
          type: "submit",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Deploy Broker`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <form class="flex flex-col gap-4 w-max"><!--[-->`;
        Label($$payload3, {
          class: "flex flex-col gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Query ID <!--[-->`;
            Input($$payload4, {
              type: "number",
              name: "queryId",
              placeholder: "777",
              required: true,
              min: "0"
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-green-800 text-white hover:bg-ds-green-700",
          type: "submit",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Deploy Account`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$brokerage", brokerage).getOwner();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Owner`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <form class="flex flex-col gap-4 w-max"><!--[-->`;
        Label($$payload3, {
          class: "flex flex-col gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Stream Address <!--[-->`;
            Input($$payload4, {
              type: "text",
              name: "stream",
              placeholder: "0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV",
              required: true,
              min: "0"
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 text-white hover:bg-ds-blue-700",
          type: "submit",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Broker`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <form class="flex flex-col gap-4 w-max"><!--[-->`;
        Label($$payload3, {
          class: "flex flex-col gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Trader <!--[-->`;
            Input($$payload4, {
              type: "text",
              name: "trader",
              placeholder: "0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV",
              required: true,
              min: "0"
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 text-white hover:bg-ds-blue-700",
          type: "submit",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Account`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$brokerage", brokerage).getStorageReserve();
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

export { BrokerageAPI as B };
//# sourceMappingURL=BrokerageAPI-NFMsbNaV.js.map
