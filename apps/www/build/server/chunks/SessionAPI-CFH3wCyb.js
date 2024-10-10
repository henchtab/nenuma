import { p as push, t as copy_payload, w as assign_payload, b as pop, d as store_get, x as store_set, u as unsubscribe_stores } from './index3-C3tkxEZ9.js';
import { B as Button } from './index4-DsCIb9oO.js';
import { f as useSession, L as Label, I as Input } from './index5-BRx1imC1.js';
import './_sentry-release-injection-file-Btn1PAw_.js';
import { a as formatOutputDate } from './utils-CiLCLP5G.js';
import { fromNano } from '@ton/core';
import { w as writable } from './index2-d8GdKNTl.js';
import { O as Output } from './Output-Dj6-g0vZ.js';
import { S as Section } from './Section2-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "e5a5b9b9-1ca2-45b3-9157-8de149965ef4", e._sentryDebugIdIdentifier = "sentry-dbid-e5a5b9b9-1ca2-45b3-9157-8de149965ef4");
  } catch (e2) {
  }
}();
function SessionAPI($$payload, $$props) {
  push();
  var $$store_subs;
  const subscriberAddress = writable("");
  const session = useSession(subscriberAddress);
  let output = [];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Section($$payload2, {
      title: "Session",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Label($$payload3, {
          class: "grid gap-2 mt-4",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Subscriber Address <!--[-->`;
            Input($$payload4, {
              type: "text",
              name: "subscriberAddress",
              placeholder: "0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj",
              required: true,
              class: "w-fit",
              get value() {
                return store_get($$store_subs ??= {}, "$subscriberAddress", subscriberAddress);
              },
              set value($$value) {
                store_set(subscriberAddress, $$value);
                $$settled = false;
              }
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <p class="mt-3 mb-8 text-ds-gray-900 max-w-[640px]">The Session contract handles individual subscriptions in a data stream system on the blockchain.
    It manages subscriber info, deposits, and notifications. Key features include: Deploying
    sessions Managing subscriptions (starting, topping up, unsubscribing) Forwarding data
    notifications (like candlesticks) Handling deposits for various actions This contract ensures
    subscribers get the data they signed up for and manages the lifecycle of a subscription
    efficiently. <br> <br> For more details, you can explore the <a class="underline" href="https://github.com/dreamqip/nenuma/blob/main/contracts/contracts/session.tact" target="_blank">contract code</a> and its functionality.</p> <div class="flex mt-8 gap-4 items-end overflow-x-auto pb-6 snap-x snap-mandatory"><form class="flex snap-start flex-col gap-4 min-w-max"><!--[-->`;
        Label($$payload3, {
          class: "flex flex-col gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Notifications Count <!--[-->`;
            Input($$payload4, {
              type: "number",
              name: "notificationsCount",
              placeholder: "4",
              required: true,
              min: "1"
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
          class: "bg-ds-teal-800 text-white hover:bg-ds-teal-700",
          type: "submit",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Subscribe`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <form class="flex snap-start flex-col gap-4 min-w-max"><!--[-->`;
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
          class: "bg-ds-teal-800 text-white hover:bg-ds-teal-700",
          type: "submit",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Unsubscribe`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <form class="flex snap-start flex-col gap-4 min-w-max"><!--[-->`;
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
          class: "bg-ds-teal-800 text-white hover:bg-ds-teal-700",
          type: "submit",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Destroy`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-pink-800 snap-start text-white hover:bg-ds-pink-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$session", session).getStreamAddress();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Stream Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-pink-800 snap-start text-white hover:bg-ds-pink-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$session", session).getBalance();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Balance`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-pink-800 snap-start text-white hover:bg-ds-pink-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$session", session).getBatchAddress();
            if (!result) {
              output.unshift({
                date: formatOutputDate(/* @__PURE__ */ new Date()),
                message: "No batch address found"
              });
              return;
            }
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Batch Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-pink-800 text-white snap-start hover:bg-ds-pink-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$session", session).getSubscriberAddress();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Subscriber Address`;
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

export { SessionAPI as S };
//# sourceMappingURL=SessionAPI-CFH3wCyb.js.map
