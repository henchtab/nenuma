import { p as push, t as copy_payload, w as assign_payload, b as pop, d as store_get, x as store_set, g as attr, u as unsubscribe_stores } from './index3-C3tkxEZ9.js';
import { B as Button } from './index4-oP-Y0xSz.js';
import { b as createCashOrNothingOption, L as Label, I as Input } from './index5-8CER8S0e.js';
import './_sentry-release-injection-file-DnBzmPpn.js';
import { f as formatTime, a as formatOutputDate } from './utils-Cu53aTbv.js';
import { fromNano, Address } from '@ton/core';
import clsx from 'clsx';
import { a as toast } from './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import { d as derived, w as writable } from './index2-d8GdKNTl.js';
import { O as Output } from './Output-B9sb5j8q.js';
import { S as Section } from './Section-4oNqorjo.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "2d0ebf71-452c-4096-9377-ee0259f4884d", e._sentryDebugIdIdentifier = "sentry-dbid-2d0ebf71-452c-4096-9377-ee0259f4884d");
  } catch (e2) {
  }
}();
function CashOrNothingAPI($$payload, $$props) {
  push();
  var $$store_subs;
  const streamAddress = writable("");
  const option = createCashOrNothingOption(streamAddress);
  const shouldDisableActions = derived([streamAddress], ([$streamAddress]) => !$streamAddress);
  let output = [];
  function formatOutput(input) {
    if (input.value === null) {
      return "Empty response.";
    }
    if (input.type === "coins") {
      return fromNano(input.value).toString();
    }
    if (input.type === "timestamp") {
      return formatTime(new Date(Number(input.value) * 1e3));
    }
    if (input.type === "object") {
      return JSON.stringify(
        input.value,
        (_, v) => {
          if (v instanceof Address) {
            return v.toString({ testOnly: true, bounceable: false });
          }
          if (typeof v === "bigint") {
            return v.toString();
          }
          return v;
        },
        2
      );
    }
    if (input.type === "address") {
      return input.value.toString({ testOnly: true, bounceable: false });
    }
    return input.value.toString();
  }
  function postToOutput(message) {
    output.unshift({
      date: formatOutputDate(/* @__PURE__ */ new Date()),
      message
    });
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Section($$payload2, {
      title: "Cash-or-Nothing Option",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<div class="grid gap-3 mt-4"><!--[-->`;
        Label($$payload3, {
          class: "grid gap-2",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Stream Address <!--[-->`;
            Input($$payload4, {
              type: "text",
              name: "streamAddress",
              placeholder: "0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj",
              required: true,
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
        $$payload3.out += `<!--]--></div> <p class="mt-3 mb-8 text-ds-gray-900 max-w-[640px]">This smart contract manages "cash-or-nothing" options. It handles deployment, validates
    agreements, monitors market data, and determines if an option is "in," "out," or "at" the money
    at expiration, sending notifications and payouts accordingly.</p> <div class="flex mt-8 gap-4 items-end overflow-x-auto pb-6 snap-x snap-mandatory"><a${attr("class", clsx("snap-start", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) && "cursor-not-allowed"))}${attr("href", store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions) ? void 0 : `/playground/options-api/deploy?contract=option&title=${encodeURIComponent("Cash-or-Nothing Option")}&subtitle=option&stream=${store_get($$store_subs ??= {}, "$streamAddress", streamAddress)}`)}><!--[-->`;
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
          class: "bg-ds-teal-800 hover:bg-ds-teal-700 text-white snap-start",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => await store_get($$store_subs ??= {}, "$option", option).checkTimeout({ queryId: BigInt(Date.now()) }),
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Check Timeout`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getOptionId();
              postToOutput(formatOutput({ type: "other", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Option ID`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getAgreement();
              postToOutput(formatOutput({ type: "object", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Agreement`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getStrikePrice();
              postToOutput(formatOutput({ type: "other", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Strike Price`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getLatestCandlestick();
              postToOutput(formatOutput({ type: "object", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Latest Candlestick`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getExpiration();
              postToOutput(formatOutput({ type: "timestamp", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Expiration`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getBalance();
              postToOutput(formatOutput({ type: "coins", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Balance`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getDeployerAddress();
              postToOutput(formatOutput({ type: "address", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Deployer Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getStreamAddress();
              postToOutput(formatOutput({ type: "address", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Stream Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getSessionAddress();
              postToOutput(formatOutput({ type: "address", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Session Address`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Button($$payload3, {
          class: "bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white",
          disabled: store_get($$store_subs ??= {}, "$shouldDisableActions", shouldDisableActions),
          onclick: async () => {
            try {
              const result = await store_get($$store_subs ??= {}, "$option", option).getNotificationsCount();
              postToOutput(formatOutput({ type: "other", value: result }));
            } catch (error) {
              toast.error("Option has not been deployed or it has expired.");
            }
          },
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `Get Notifications Count`;
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

export { CashOrNothingAPI as C };
//# sourceMappingURL=CashOrNothingAPI-yHz0lTpS.js.map
