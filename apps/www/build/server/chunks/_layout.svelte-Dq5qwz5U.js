import { b as pop, p as push, q as getContext, g as attr, d as store_get, u as unsubscribe_stores, f as ensure_array_like, n as escape_html, h as spread_attributes, l as spread_props, i as slot, o as sanitize_props } from './index3-C3tkxEZ9.js';
import 'clsx';
import { T as TON_CONNECT_UI_CONTEXT } from './constants-Bz-hBKcM.js';
import { h as hapticFeedback } from './tma-CErptf5t.js';
import './_sentry-release-injection-file-Btn1PAw_.js';
import { l as logo } from './logo-C4vqx6Hq.js';
import { B as Button } from './index4-DsCIb9oO.js';
import { A as AccountBalance, D as Drawer, T as Trigger, a as Drawer_content, b as Drawer_header, C as Close, S as Skeleton, M as Menu, c as Drawer_title, d as TonLogo, W as Wallet, X } from './TonLogo-iOC8Mvux.js';
import { i as isConnected, a as isReconnecting } from './ton-connect-Ha9sPh3g.js';
import { K as KlineTopic, l as latestPrices } from './ws.svelte-joDEF7Aj.js';
import { s as shortenAddress } from './shorten-address-BzBE3CFg.js';
import { I as Icon } from './Icon-DC-Mh-BG.js';
import { d as default_slot } from './misc-DisFbBK1.js';
import './utils2-CiK4tJ06.js';
import '@ton/ton';
import './index2-d8GdKNTl.js';
import './utils-CiLCLP5G.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './updater-DKM5rKh5.js';
import './sleep-CMjvr8cL.js';
import './public-BbnfBXYT.js';
import 'js-cookie';
import '@tonconnect/ui';
import './context-DhSgOhFj.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "06a39e73-ced6-46cd-9c5a-dd18ae876336", e._sentryDebugIdIdentifier = "sentry-dbid-06a39e73-ced6-46cd-9c5a-dd18ae876336");
  } catch (e2) {
  }
}();
function Test_tubes($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2"
      }
    ],
    [
      "path",
      {
        "d": "M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2"
      }
    ],
    ["path", { "d": "M3 2h7" }],
    ["path", { "d": "M14 2h7" }],
    ["path", { "d": "M9 16H4" }],
    ["path", { "d": "M20 16h-5" }]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "test-tubes" },
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
function Header($$payload, $$props) {
  push();
  var $$store_subs;
  const tonConnect = getContext(TON_CONNECT_UI_CONTEXT);
  const items = [
    {
      symbol: "BTC",
      href: "/dashboard/BTCUSDT",
      name: "Bitcoin",
      priceKey: KlineTopic.BTCUSDT
    }
  ];
  $$payload.out += `<header class="border-b sticky h-16 top-0 z-50 bg-ds-background-200"><div class="container pr-0 flex justify-between items-center"><img${attr("src", logo)} alt="Nenuma" class="w-8 h-8"> <div class="flex items-center p-4"><!--[-->`;
  if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
    $$payload.out += `<!--[-->`;
    AccountBalance($$payload);
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += "<!--]!-->";
  }
  $$payload.out += ` <!--[-->`;
  Drawer($$payload, {
    children: ($$payload2, $$slotProps) => {
      $$payload2.out += `<!--[-->`;
      Trigger($$payload2, {
        class: "w-8 h-8 border border-ds-gray-400 ml-2 rounded-full",
        onclick: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("light"),
        children: ($$payload3, $$slotProps2) => {
          $$payload3.out += `<!--[-->`;
          Menu($$payload3, { class: "overflow-visible m-auto", size: "16" });
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]--> <!--[-->`;
      Drawer_content($$payload2, {
        children: ($$payload3, $$slotProps2) => {
          const each_array = ensure_array_like(items);
          $$payload3.out += `<input type="checkbox" id="drawer" class="sr-only" aria-hidden="true"> <!--[-->`;
          Drawer_header($$payload3, {
            children: ($$payload4, $$slotProps3) => {
              $$payload4.out += `<!--[-->`;
              Drawer_title($$payload4, {
                children: ($$payload5, $$slotProps4) => {
                  $$payload5.out += `Navigation`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!--]--> <!--[-->`;
              Close($$payload4, {
                onclick: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("light"),
                children: ($$payload5, $$slotProps4) => {
                  $$payload5.out += `<div class="w-8 h-8 border border-ds-gray-400 transition-colors text-ds-gray-1000 hover:bg-ds-gray-200 bg-ds-gray-100 inline-flex items-center justify-center rounded-full"><!--[-->`;
                  X($$payload5, { class: "overflow-visible", size: "20" });
                  $$payload5.out += `<!--]--></div>`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!--]-->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--> <nav class="gap-3 pt-4 pb-8 overflow-y-auto container"><section><span class="text-base mb-2 text-ds-gray-900">Trading Pairs</span> <div class="pl-2"><!--[-->`;
          for (let $$index = 0; $$index < each_array.length; $$index++) {
            const item = each_array[$$index];
            $$payload3.out += "<!--[-->";
            $$payload3.out += `<!--[-->`;
            Close($$payload3, {
              asChild: true,
              children: ($$payload4, $$slotProps3) => {
                const builder = $$slotProps3.builder;
                $$payload4.out += `<a${spread_attributes({
                  ...builder,
                  class: "flex justify-between items-center h-12",
                  href: item.href
                })}><div class="flex flex-col items-baseline"><div><span class="text-ds-gray-1000 text-left text-lg tracking-tight font-medium">${escape_html(item.symbol)}</span> <span class="text-ds-gray-900 text-sm">/ USDT</span></div></div> <div class="text-ds-gray-1000 flex-1 text-lg justify-end flex font-medium">${escape_html(store_get($$store_subs ??= {}, "$latestPrices", latestPrices)[item.priceKey].toFixed(2))} $</div></a>`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!--]-->`;
            $$payload3.out += "<!--]-->";
          }
          $$payload3.out += "<!--]-->";
          $$payload3.out += `</div></section> <div class="py-3 grid"><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex h-12 justify-between items-center",
                href: "/playground"
              })}><div class="font-medium text-ds-gray-1000 text-lg">Playground</div> <!--[-->`;
              Test_tubes($$payload4, { size: "20" });
              $$payload4.out += `<!--]--></a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></div> <!--[-->`;
          Skeleton($$payload3, {
            class: "w-full",
            show: store_get($$store_subs ??= {}, "$isReconnecting", isReconnecting),
            children: ($$payload4, $$slotProps3) => {
              $$payload4.out += `<!--[-->`;
              if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
                $$payload4.out += `<!--[-->`;
                Button($$payload4, {
                  class: "w-full gap-2",
                  onclickcapture: () => {
                    store_get($$store_subs ??= {}, "$tonConnect", tonConnect).disconnectWallet();
                    store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("medium");
                  },
                  children: ($$payload5, $$slotProps4) => {
                    $$payload5.out += `<!--[-->`;
                    TonLogo($$payload5);
                    $$payload5.out += `<!--]--> ${escape_html(shortenAddress(store_get($$store_subs ??= {}, "$tonConnect", tonConnect).connection.wallet.account.address))}`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!--]-->`;
                $$payload4.out += "<!--]-->";
              } else {
                $$payload4.out += `<!--[-->`;
                Button($$payload4, {
                  class: "w-full gap-2",
                  onclickcapture: () => {
                    store_get($$store_subs ??= {}, "$tonConnect", tonConnect).connectWallet();
                    store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("medium");
                  },
                  children: ($$payload5, $$slotProps4) => {
                    $$payload5.out += `<!--[-->`;
                    Wallet($$payload5, { size: 16 });
                    $$payload5.out += `<!--]--> Connect Wallet`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!--]-->`;
                $$payload4.out += "<!--]!-->";
              }
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></nav>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!--]--></div></div></header>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  $$payload.out += `<!--[-->`;
  Header($$payload);
  $$payload.out += `<!--]--> <!--[-->`;
  children($$payload);
  $$payload.out += `<!--]-->`;
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-Dq5qwz5U.js.map
