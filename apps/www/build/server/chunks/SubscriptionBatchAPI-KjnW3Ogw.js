import { p as push, t as copy_payload, w as assign_payload, b as pop, d as store_get, x as store_set, u as unsubscribe_stores } from './index3-C3tkxEZ9.js';
import { B as Button } from './index4-BlIEbkCH.js';
import { e as useSubscriptioBatch, L as Label, I as Input } from './index5-DdGzW48b.js';
import './_sentry-release-injection-file-D10jjuQQ.js';
import { a as formatOutputDate } from './utils-D1S0724n.js';
import { fromNano } from '@ton/core';
import { w as writable } from './index2-d8GdKNTl.js';
import { O as Output } from './Output-B30zo6Pi.js';
import { S as Section } from './Section2-4oNqorjo.js';
import { a as toast } from './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "ff57b30b-7e52-41bb-b99a-80e28baf4ca5", e._sentryDebugIdIdentifier = "sentry-dbid-ff57b30b-7e52-41bb-b99a-80e28baf4ca5");
  } catch (e2) {
  }
}();
function SubscriptionBatchAPI($$payload, $$props) {
  push();
  var $$store_subs;
  const batchId = writable(0);
  const batch = useSubscriptioBatch(batchId);
  let output = [];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Section($$payload2, {
      title: "Subscription Batch",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Label($$payload3, {
          class: "grid gap-2 mt-4",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Batch ID <!--[-->`;
            Input($$payload4, {
              type: "number",
              placeholder: "0",
              required: true,
              min: "0",
              class: "w-fit",
              get value() {
                return store_get($$store_subs ??= {}, "$batchId", batchId);
              },
              set value($$value) {
                store_set(batchId, $$value);
                $$settled = false;
              }
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <p class="mt-3 mb-8 text-ds-gray-900 max-w-[768px]">Subscription Batch is a smart contract that handles subscription management for data streams on
    the blockchain. It lets publishers manage multiple subscriptions, track remaining notifications,
    and handle deposits. Key features include adding new subscriptions, topping up existing ones,
    and publishing data (like candlesticks). It also ensures that subscribers receive timely
    notifications and that publishers cover costs efficiently. <br> <br> For more details, you
    can explore the <a class="underline" href="https://github.com/dreamqip/nenuma/blob/main/contracts/contracts/subscription_batch.tact" target="_blank">contract code</a> and its functionality.</p> <div class="flex mt-8 gap-4 items-end overflow-x-auto snap-x snap-mandatory pb-6"><!--[-->`;
        Button($$payload3, {
          class: "bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700",
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$batch", batch).getBalance();
              output.unshift({
                date: formatOutputDate(/* @__PURE__ */ new Date()),
                message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
              });
            } catch (error) {
              if (error instanceof Error) {
                if (error.message.includes("-256")) {
                  toast.error(`Subscription Batch with id ${store_get($$store_subs ??= {}, "$batchId", batchId)} not found. Did you deploy it?`);
                }
              }
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Balance`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700",
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$batch", batch).getBatchId();
              output.unshift({
                date: formatOutputDate(/* @__PURE__ */ new Date()),
                message: JSON.stringify(result.toString(), null, 2)
              });
            } catch (error) {
              if (error instanceof Error) {
                if (error.message.includes("-256")) {
                  toast.error(`Subscription Batch with id ${store_get($$store_subs ??= {}, "$batchId", batchId)} not found. Did you deploy it?`);
                }
              }
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Batch ID`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700",
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$batch", batch).getStreamAddress();
              output.unshift({
                date: formatOutputDate(/* @__PURE__ */ new Date()),
                message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
              });
            } catch (error) {
              if (error instanceof Error) {
                if (error.message.includes("-256")) {
                  toast.error(`Subscription Batch with id ${store_get($$store_subs ??= {}, "$batchId", batchId)} not found. Did you deploy it?`);
                }
              }
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Stream Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700",
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$batch", batch).getSubscriptions();
              const subscriptions = [];
              for (const [address, info] of result) {
                subscriptions.push({
                  [address.toString({ testOnly: true, bounceable: false })]: {
                    remainingNotificationsCount: info.remainingNotificationsCount.toString()
                  }
                });
              }
              output.unshift({
                date: formatOutputDate(/* @__PURE__ */ new Date()),
                message: JSON.stringify(subscriptions, null, 2)
              });
            } catch (error) {
              if (error instanceof Error) {
                if (error.message.includes("-256")) {
                  toast.error(`Subscription Batch with id ${store_get($$store_subs ??= {}, "$batchId", batchId)} not found. Did you deploy it?`);
                }
              }
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Subscriptions`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700",
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$batch", batch).getSubscriptionsCount();
              output.unshift({
                date: formatOutputDate(/* @__PURE__ */ new Date()),
                message: JSON.stringify(result.toString(), null, 2)
              });
            } catch (error) {
              if (error instanceof Error) {
                if (error.message.includes("-256")) {
                  toast.error(`Subscription Batch with id ${store_get($$store_subs ??= {}, "$batchId", batchId)} not found. Did you deploy it?`);
                }
              }
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Subscriptions Count`;
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

export { SubscriptionBatchAPI as S };
//# sourceMappingURL=SubscriptionBatchAPI-KjnW3Ogw.js.map
