import { p as push, t as copy_payload, w as assign_payload, b as pop, d as store_get, x as store_set, g as attr, u as unsubscribe_stores } from './index3-C3tkxEZ9.js';
import { B as Button } from './index4-Bx_7Dk7S.js';
import { g as createSimpleSubscriber, L as Label, I as Input } from './index5-DiRIAbbA.js';
import './_sentry-release-injection-file-DHom2vTX.js';
import { a as formatOutputDate } from './utils-D4QS32x_.js';
import { fromNano } from '@ton/core';
import { w as writable } from './index2-d8GdKNTl.js';
import { O as Output } from './Output-D-Q6WW_G.js';
import { S as Section } from './Section2-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "3ff49c29-382a-4fdf-970b-55d85096a1ec", e._sentryDebugIdIdentifier = "sentry-dbid-3ff49c29-382a-4fdf-970b-55d85096a1ec");
  } catch (e2) {
  }
}();
function SimpleSubscriberAPI($$payload, $$props) {
  push();
  var $$store_subs;
  const simpleSubscriberAddress = writable("");
  const simpleSubscriber = createSimpleSubscriber(simpleSubscriberAddress);
  let output = [];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Section($$payload2, {
      title: "Simple Subscriber",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Label($$payload3, {
          class: "grid gap-2 mt-4",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Simple Subscriber Address <!--[-->`;
            Input($$payload4, {
              type: "text",
              name: "simpleSubscriberAddress",
              placeholder: "0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj",
              required: true,
              class: "w-fit",
              get value() {
                return store_get($$store_subs ??= {}, "$simpleSubscriberAddress", simpleSubscriberAddress);
              },
              set value($$value) {
                store_set(simpleSubscriberAddress, $$value);
                $$settled = false;
              }
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <p class="mt-3 mb-8 text-ds-gray-900 max-w-[768px]">This contract sets up with an owner address and a subscriber ID. It handles subscriptions to a
    data stream, making sure there are enough funds for operations. When deployment requests come
    in, it sets the stream address, notification count, and expiration time. You can check the
    balance, owner address, number of notifications, expiration time, stream address, session
    address, and the latest candlestick data. It deals with subscribing, unsubscribing, and
    destroying sessions, even if transactions bounce. It also checks for expired subscriptions and
    notifies when time is up. Overall, it keeps the subscription process smooth and organized.</p> <div class="flex gap-4 items-end overflow-x-auto pb-6 snap-x snap-mandatory"><a class="snap-start"${attr("href", `/playground/streams-api/deploy?contract=subscriber&title=${encodeURIComponent("Simple Subscriber")}&subtitle=simple subscriber`)}><!--[-->`;
        Button($$payload3, {
          class: "bg-ds-green-800 text-white hover:bg-ds-green-700",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Deploy Simple Subscriber`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></a> <form class="flex snap-start flex-col gap-4 min-w-max"><!--[-->`;
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
            $$payload4.out += `Check timeout`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$simpleSubscriber", simpleSubscriber).getBalance();
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
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$simpleSubscriber", simpleSubscriber).getOwnerAddress();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Owner Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$simpleSubscriber", simpleSubscriber).getNotificationsCount();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result?.toString(), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Notifications Count`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$simpleSubscriber", simpleSubscriber).getExpiresAt();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result?.toString(), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Expires At`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$simpleSubscriber", simpleSubscriber).getStreamAddress();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result?.toString({ testOnly: true, bounceable: false }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Stream Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$simpleSubscriber", simpleSubscriber).getSessionAddress();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result?.toString({ testOnly: true, bounceable: false }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Session Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$simpleSubscriber", simpleSubscriber).getLatestCandlestick();
            if (!result) {
              output.unshift({
                date: formatOutputDate(/* @__PURE__ */ new Date()),
                message: "No candlestick found"
              });
              return;
            }
            const serialized = {
              start: result.start.toString(),
              end: result.end.toString(),
              open: result.open.toString(),
              high: result.high.toString(),
              low: result.low.toString(),
              close: result.close.toString()
            };
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(serialized, null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Latest Candlestick`;
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

export { SimpleSubscriberAPI as S };
//# sourceMappingURL=SimpleSubscriberAPI-0TGc-7tH.js.map
