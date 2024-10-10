import { p as push, t as copy_payload, w as assign_payload, b as pop, d as store_get, x as store_set, g as attr, u as unsubscribe_stores } from './index3-C3tkxEZ9.js';
import { B as Button } from './index4-Bx_7Dk7S.js';
import { d as createDataStream, L as Label, I as Input } from './index5-DiRIAbbA.js';
import './_sentry-release-injection-file-DHom2vTX.js';
import { c as cn, a as formatOutputDate } from './utils-D4QS32x_.js';
import { fromNano } from '@ton/core';
import { a as toast } from './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import { d as derived, w as writable } from './index2-d8GdKNTl.js';
import { O as Output } from './Output-D-Q6WW_G.js';
import { S as Section } from './Section2-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "be582b89-7d6b-4d70-adb4-4aa9f805dd8a", e._sentryDebugIdIdentifier = "sentry-dbid-be582b89-7d6b-4d70-adb4-4aa9f805dd8a");
  } catch (e2) {
  }
}();
function DataStreamAPI($$payload, $$props) {
  push();
  var $$store_subs;
  const streamAddress = writable("");
  const stream = createDataStream(streamAddress);
  const shouldDisableActions = derived([streamAddress], ([$streamAddress]) => !$streamAddress);
  let output = [];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Section($$payload2, {
      title: "Data Stream",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Label($$payload3, {
          class: "grid gap-2 mt-4",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Stream Address <!--[-->`;
            Input($$payload4, {
              type: "text",
              placeholder: "0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj",
              class: "w-fit",
              get value() {
                return store_get($$store_subs ??= {}, "$streamAddress", streamAddress);
              },
              set value($$value) {
                store_set(streamAddress, $$value);
                $$settled = false;
              }
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <p class="mt-3 mb-8 text-ds-gray-900 max-w-[768px]">The Data Stream smart contract makes it easy to securely stream data and manage subscriptions on
    the blockchain. Publishers can deploy data batches, handle sessions, and manage subscriptions
    effortlessly. It ensures safe handling of deposits and notifications, offering a solid framework
    for real-time data interaction. Key features include verifying publishers, creating batches,
    deploying sessions, and automating notifications. <br> <br> For more details, check out the <a class="underline" href="https://github.com/dreamqip/nenuma/blob/main/contracts/contracts/data_stream.tact" target="_blank">contract code</a> and its features here.</p> <div class="flex gap-4 pb-6 items-end overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:_touch] scroll-smooth"><a${attr("class", cn("snap-start", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) && "cursor-not-allowed"))}${attr("href", `/playground/streams-api/deploy?contract=stream&title=${encodeURIComponent("Data Stream")}&subtitle=stream`)}><!--[-->`;
        Button($$payload3, {
          class: "bg-ds-teal-800 hover:bg-ds-teal-700 text-white",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Deploy Stream`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></a> <a${attr("class", cn("snap-start", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) && "cursor-not-allowed"))}${attr("href", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) ? void 0 : `/playground/streams-api/deploy?contract=batch&title=${encodeURIComponent("Subscription Batch")}&subtitle=batch&streamAddress=${store_get($$store_subs ??= {}, "$streamAddress", streamAddress)}`)}><!--[-->`;
        Button($$payload3, {
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          class: "bg-ds-teal-800 hover:bg-ds-teal-700 text-white",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Deploy Batch`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></a> <a${attr("class", cn("snap-start", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) && "cursor-not-allowed"))}${attr("href", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) ? void 0 : `/playground/streams-api/deploy?contract=session&title=${encodeURIComponent("Session")}&subtitle=session&streamAddress=${store_get($$store_subs ??= {}, "$streamAddress", streamAddress)}`)}><!--[-->`;
        Button($$payload3, {
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          class: "bg-ds-teal-800 hover:bg-ds-teal-700 text-white",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Deploy Session`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></a> <a${attr("class", cn("snap-start", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) && "cursor-not-allowed"))}${attr("href", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) ? void 0 : `/playground/streams-api/deploy?contract=candlestick&title=${encodeURIComponent("Candlestick")}&subtitle=candlestick&streamAddress=${store_get($$store_subs ??= {}, "$streamAddress", streamAddress)}`)}><!--[-->`;
        Button($$payload3, {
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          class: "bg-ds-teal-800 hover:bg-ds-teal-700 text-white",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Publish Candlestick`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></a> <!--[-->`;
        Button($$payload3, {
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$stream", stream).getTopic();
              output.unshift({
                date: formatOutputDate(/* @__PURE__ */ new Date()),
                message: JSON.stringify(result, null, 2)
              });
            } catch (error) {
              if (error instanceof Error) {
                toast.error(error.message);
              }
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Topic`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$stream", stream).getBalance();
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
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$stream", stream).getNextBatchId();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString(), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Next Batch Id`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <form class="flex snap-start flex-col gap-4"><!--[-->`;
        Label($$payload3, {
          class: "grid gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Subscriber Address <!--[-->`;
            Input($$payload4, {
              type: "text",
              name: "subscriberAddress",
              placeholder: "Enter a subscriber address",
              required: true
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          type: "submit",
          class: "bg-ds-blue-800 text-white hover:bg-ds-blue-700",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Session Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <form class="flex snap-start flex-col gap-4"><!--[-->`;
        Label($$payload3, {
          class: "grid gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Batch ID <!--[-->`;
            Input($$payload4, {
              type: "number",
              name: "batchId",
              placeholder: "Enter a batch ID",
              required: true
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          type: "submit",
          class: "bg-ds-blue-800 text-white hover:bg-ds-blue-700",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Batch Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <!--[-->`;
        Button($$payload3, {
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$stream", stream).getBatches();
            const batches = [];
            for (const [address, info] of result) {
              batches.push({
                [address.toString({ testOnly: true, bounceable: false })]: info.subscriptionsCount.toString()
              });
            }
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(batches, null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Batches`;
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

export { DataStreamAPI as D };
//# sourceMappingURL=DataStreamAPI-frDTQJ8c.js.map
