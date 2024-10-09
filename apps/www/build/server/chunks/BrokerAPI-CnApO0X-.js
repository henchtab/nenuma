import { p as push, t as copy_payload, w as assign_payload, b as pop, d as store_get, x as store_set, g as attr, u as unsubscribe_stores } from './index3-C3tkxEZ9.js';
import { B as Button } from './index4-C3ooMKJa.js';
import { u as useBroker, L as Label, I as Input } from './index5-CbGI2GMt.js';
import './_sentry-release-injection-file-B-U-aYmd.js';
import { a as formatOutputDate } from './utils-h3ohtT7M.js';
import { fromNano } from '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import { d as derived, w as writable } from './index2-d8GdKNTl.js';
import { O as Output } from './Output-BEcvFXv2.js';
import { S as Section } from './Section-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "9304be30-e714-47e5-b6fd-7baf966d6397", e._sentryDebugIdIdentifier = "sentry-dbid-9304be30-e714-47e5-b6fd-7baf966d6397");
  } catch (e2) {
  }
}();
function BrokerAPI($$payload, $$props) {
  push();
  var $$store_subs;
  const brokerAddress = writable("");
  const broker = useBroker(brokerAddress);
  const shouldDisableActions = derived([brokerAddress], ([$brokerAddress]) => !$brokerAddress);
  let output = [];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Section($$payload2, {
      title: "Broker",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Label($$payload3, {
          class: "grid gap-2 mt-4",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Broker Address <!--[-->`;
            Input($$payload4, {
              type: "text",
              placeholder: "0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj",
              class: "w-fit",
              get value() {
                return store_get($$store_subs ??= {}, "$brokerAddress", brokerAddress);
              },
              set value($$value) {
                store_set(brokerAddress, $$value);
                $$settled = false;
              }
            });
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <p class="mt-3 mb-8 text-ds-gray-900 max-w-[640px]">Handles brokers and cash-or-nothing options. Sets up options, checks agreements, and ensures
    enough deposit. Manages deposits and withdrawals, handles deployments, payouts, and
    notifications for options settling in, out, or at the money. Keeps track of balances and sends
    success messages to the right folks.</p> <div class="flex gap-4 items-end overflow-x-auto snap-x snap-mandatory pb-6"><a class="snap-start"${attr("href", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) ? void 0 : `/playground/options-api/deploy?contract=brokerDeposit&title=${encodeURIComponent("Deposit Broker")}&forceTitle=true&broker=${store_get($$store_subs ??= {}, "$brokerAddress", brokerAddress)}`)}><!--[-->`;
        Button($$payload3, {
          class: "bg-ds-teal-800 hover:bg-ds-teal-700 text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Deposit`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></a> <!--[-->`;
        Button($$payload3, {
          class: "snap-start bg-ds-teal-800 hover:bg-ds-teal-700 text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => await store_get($$store_subs ??= {}, "$broker", broker).withdraw({ queryId: BigInt(Date.now()) }),
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Withdraw`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <a class="snap-start"${attr("href", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) ? void 0 : `/playground/options-api/deploy?contract=brokerOption&title=${encodeURIComponent("Cash-or-Nothing Option")}&broker=${store_get($$store_subs ??= {}, "$brokerAddress", brokerAddress)}`)}><!--[-->`;
        Button($$payload3, {
          class: "bg-ds-teal-800 hover:bg-ds-teal-700 text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Deploy Option`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></a> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 text-white hover:bg-ds-blue-700 snap-start",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$broker", broker).getBalance();
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
          class: "bg-ds-blue-800 text-white hover:bg-ds-blue-700 snap-start",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$broker", broker).getOwner();
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
        $$payload3.out += `<!--]--> <form class="flex flex-col gap-4 w-max snap-start"><div class="grid gap-2"><!--[-->`;
        Label($$payload3, {
          for: "optionId",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Option ID`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Input($$payload3, {
          type: "number",
          name: "optionId",
          id: "optionId",
          placeholder: "777",
          required: true,
          min: "0"
        });
        $$payload3.out += `<!--]--></div> <!--[-->`;
        Button($$payload3, {
          type: "submit",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          class: "bg-ds-blue-800 text-white hover:bg-ds-blue-700",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Option Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--></form> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$broker", broker).getNextOptionId();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString(), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Next Option ID`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$broker", broker).getStream();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Stream`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            const result = await store_get($$store_subs ??= {}, "$broker", broker).getPayout();
            output.unshift({
              date: formatOutputDate(/* @__PURE__ */ new Date()),
              message: JSON.stringify(
                {
                  nominator: result.nominator.toString(),
                  denominator: result.denominator.toString()
                },
                null,
                2
              )
            });
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Payout Coefficient`;
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

export { BrokerAPI as B };
//# sourceMappingURL=BrokerAPI-CnApO0X-.js.map
