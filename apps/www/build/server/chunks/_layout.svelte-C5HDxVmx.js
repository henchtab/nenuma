import { q as getContext, g as attr, d as store_get, u as unsubscribe_stores, b as pop, p as push, f as ensure_array_like, n as escape_html, l as spread_props, i as slot, h as spread_attributes, o as sanitize_props } from './index3-C3tkxEZ9.js';
import { l as logo } from './logo-C4vqx6Hq.js';
import { A as AccountBalance, D as Drawer, T as Trigger, a as Drawer_content, b as Drawer_header, C as Close, S as Skeleton, c as Drawer_title, M as Menu, d as TonLogo, W as Wallet, X } from './TonLogo-BcCeyCUR.js';
import './_sentry-release-injection-file-D10jjuQQ.js';
import { B as Button } from './index4-BlIEbkCH.js';
import { T as TON_CONNECT_UI_CONTEXT } from './constants-D2ZMuuf5.js';
import { s as shortenAddress } from './shorten-address-C6WFeI6i.js';
import { h as hapticFeedback } from './tma-DE_E59BU.js';
import { i as isConnected, a as isReconnecting } from './ton-connect-DdpIiAEw.js';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import { I as Icon } from './Icon-DC-Mh-BG.js';
import { d as default_slot } from './misc-DisFbBK1.js';
import './utils2-CiK4tJ06.js';
import './index2-d8GdKNTl.js';
import './utils-D1S0724n.js';
import 'clsx';
import 'tailwind-merge';
import './updater-Rm0iswZ7.js';
import './sleep-CMjvr8cL.js';
import './public-BCOIycai.js';
import 'js-cookie';
import 'tailwind-variants';
import '@ton/ton';
import './context-EGUegBOV.js';
import '@tonconnect/ui';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "6967a07f-554a-45b3-810a-c3a9568bddbe", e._sentryDebugIdIdentifier = "sentry-dbid-6967a07f-554a-45b3-810a-c3a9568bddbe");
  } catch (e2) {
  }
}();
function Bell($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
      }
    ],
    [
      "path",
      { "d": "M10.3 21a1.94 1.94 0 0 0 3.4 0" }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "bell" },
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
function Bookmark($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
      }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "bookmark" },
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
function Briefcase_business($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 12h.01" }],
    [
      "path",
      {
        "d": "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
      }
    ],
    [
      "path",
      { "d": "M22 13a18.15 18.15 0 0 1-20 0" }
    ],
    [
      "rect",
      {
        "width": "20",
        "height": "14",
        "x": "2",
        "y": "6",
        "rx": "2"
      }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "briefcase-business" },
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
function Building($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "16",
        "height": "20",
        "x": "4",
        "y": "2",
        "rx": "2",
        "ry": "2"
      }
    ],
    ["path", { "d": "M9 22v-4h6v4" }],
    ["path", { "d": "M8 6h.01" }],
    ["path", { "d": "M16 6h.01" }],
    ["path", { "d": "M12 6h.01" }],
    ["path", { "d": "M12 10h.01" }],
    ["path", { "d": "M12 14h.01" }],
    ["path", { "d": "M16 10h.01" }],
    ["path", { "d": "M16 14h.01" }],
    ["path", { "d": "M8 10h.01" }],
    ["path", { "d": "M8 14h.01" }]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "building" },
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
function Credit_card($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "20",
        "height": "14",
        "x": "2",
        "y": "5",
        "rx": "2"
      }
    ],
    [
      "line",
      {
        "x1": "2",
        "x2": "22",
        "y1": "10",
        "y2": "10"
      }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "credit-card" },
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
function Database($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "ellipse",
      { "cx": "12", "cy": "5", "rx": "9", "ry": "3" }
    ],
    [
      "path",
      { "d": "M3 5V19A9 3 0 0 0 21 19V5" }
    ],
    ["path", { "d": "M3 12A9 3 0 0 0 21 12" }]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "database" },
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
function Layers($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
      }
    ],
    [
      "path",
      {
        "d": "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"
      }
    ],
    [
      "path",
      {
        "d": "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
      }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "layers" },
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
function User_check($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      }
    ],
    [
      "circle",
      { "cx": "9", "cy": "7", "r": "4" }
    ],
    [
      "polyline",
      { "points": "16 11 18 13 22 9" }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "user-check" },
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
function User($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      }
    ],
    [
      "circle",
      { "cx": "12", "cy": "7", "r": "4" }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "user" },
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
function Saved($$payload, $$props) {
  push();
  const ItemType = {
    Stream: "stream",
    SubscriptionBatch: "subscription_batch",
    Session: "session",
    SimpleSubscriber: "simple_subscriber",
    Brokerage: "brokerage",
    Broker: "broker",
    BrokerageAccount: "brokerage_account",
    CashOrNothingOption: "cash-or-nothing_option"
  };
  const ItemIcon = {
    [ItemType.Stream]: Database,
    [ItemType.SubscriptionBatch]: Layers,
    [ItemType.Session]: Bell,
    [ItemType.SimpleSubscriber]: User,
    [ItemType.Brokerage]: Building,
    [ItemType.Broker]: Briefcase_business,
    [ItemType.BrokerageAccount]: User_check,
    [ItemType.CashOrNothingOption]: Credit_card
  };
  let items = [];
  function shortenAddress2(address) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }
  const each_array = ensure_array_like(items);
  $$payload.out += `<div class="container flex flex-col bg-ds-background-200 flex-1 gap-4 py-6 overflow-y-auto"><ul class="shadow-md"><!--[-->`;
  for (let $$index = 0; $$index < each_array.length; $$index++) {
    const item = each_array[$$index];
    $$payload.out += "<!--[-->";
    $$payload.out += `<li class="bg-ds-gray-100 items-center relative flex justify-center hover:bg-ds-gray-200 transition-colors group overflow-hidden first:rounded-t-md last:rounded-b-md"><!--[-->`;
    Close($$payload, {
      asChild: true,
      children: ($$payload2, $$slotProps) => {
        const builder = $$slotProps.builder;
        $$payload2.out += `<button${spread_attributes({
          ...builder,
          class: "text-ds-gray-1000 items-center flex-1 flex gap-4 text-left rounded-md",
          "data-address": item.address
        })}><span class="pl-3"><!--[-->`;
        ItemIcon[item.type]?.($$payload2, {
          "aria-hidden": "true",
          size: 20,
          strokeWidth: 1.5,
          class: "overflow-visible"
        });
        $$payload2.out += `<!--]--></span> <div class="flex pr-3 border-b justify-center flex-col min-h-14 flex-1 group-last:border-none"><span class="text-sm">${escape_html(shortenAddress2(item.address))}</span> <span class="text-ds-gray-900 capitalize text-xs">${escape_html(item.type.split("_").join(" "))}</span></div></button>`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!--]--></li>`;
    $$payload.out += "<!--]-->";
  }
  $$payload.out += "<!--]-->";
  $$payload.out += `</ul></div>`;
  pop();
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { children } = $$props;
  const tonConnect = getContext(TON_CONNECT_UI_CONTEXT);
  $$payload.out += `<header class="border-b sticky top-0 h-16 overflow-hidden bg-ds-background-200 z-50"><div class="flex items-center h-full justify-between container"><img${attr("src", logo)} alt="Nenuma" class="w-8 h-8"> <div class="py-4 flex"><div class="inline-flex items-center gap-1"><!--[-->`;
  if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
    $$payload.out += `<!--[-->`;
    AccountBalance($$payload);
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += "<!--]!-->";
  }
  $$payload.out += `</div> <!--[-->`;
  Drawer($$payload, {
    onOpenChange: (v) => v,
    children: ($$payload2, $$slotProps) => {
      $$payload2.out += `<!--[-->`;
      Trigger($$payload2, {
        class: "w-8 h-8 border border-ds-gray-400 rounded-full ml-2",
        onclick: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("light"),
        children: ($$payload3, $$slotProps2) => {
          $$payload3.out += `<!--[-->`;
          Bookmark($$payload3, {
            class: "overflow-visible m-auto",
            size: "16",
            strokeWidth: 1.5
          });
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]--> <!--[-->`;
      Drawer_content($$payload2, {
        children: ($$payload3, $$slotProps2) => {
          $$payload3.out += `<input type="checkbox" class="sr-only" aria-hidden="true"> <!--[-->`;
          Drawer_header($$payload3, {
            children: ($$payload4, $$slotProps3) => {
              $$payload4.out += `<!--[-->`;
              Drawer_title($$payload4, {
                children: ($$payload5, $$slotProps4) => {
                  $$payload5.out += `Deployed Accounts`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!--]--> <!--[-->`;
              Close($$payload4, {
                onclick: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("light"),
                children: ($$payload5, $$slotProps4) => {
                  $$payload5.out += `<div class="w-8 h-8 border border-ds-gray-400 transition-colors text-ds-gray-1000 hover:bg-ds-gray-200 bg-ds-gray-100 inline-flex items-center justify-center rounded-full"><!--[-->`;
                  X($$payload5, {
                    class: "overflow-visible",
                    size: "20",
                    strokeWidth: 2
                  });
                  $$payload5.out += `<!--]--></div>`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!--]-->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--> <!--[-->`;
          Saved($$payload3);
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!--]--> <!--[-->`;
  Drawer($$payload, {
    children: ($$payload2, $$slotProps) => {
      $$payload2.out += `<!--[-->`;
      Trigger($$payload2, {
        class: "w-8 h-8 border border-ds-gray-400 rounded-full ml-2",
        onclick: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("light"),
        children: ($$payload3, $$slotProps2) => {
          $$payload3.out += `<!--[-->`;
          Menu($$payload3, {
            class: "overflow-visible m-auto",
            size: "16",
            strokeWidth: 1.5
          });
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]--> <!--[-->`;
      Drawer_content($$payload2, {
        children: ($$payload3, $$slotProps2) => {
          $$payload3.out += `<input type="checkbox" class="sr-only" aria-hidden="true"> <!--[-->`;
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
                  X($$payload5, {
                    class: "overflow-visible",
                    size: "20",
                    strokeWidth: 2
                  });
                  $$payload5.out += `<!--]--></div>`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!--]-->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--> <div class="container pt-4 pb-8 overflow-y-scroll"><input class="sr-only" aria-hidden="true" type="checkbox"> <nav class="grid gap-3"><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex justify-between items-center h-12 text-lg font-medium",
                href: "/dashboard"
              })}>Derivatives Exchange</a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--> <section class="flex flex-col"><span class="text-base mb-2 text-ds-gray-900">Streams API</span> <ul class="pl-2"><li><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex justify-between items-center h-12 text-lg font-medium",
                href: "/playground/streams-api/data-stream"
              })}>Data Stream</a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></li> <li><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex justify-between items-center h-12 text-lg font-medium",
                href: "/playground/streams-api/subscription-batch"
              })}>Subscription Batch</a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></li> <li><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex justify-between items-center h-12 text-lg font-medium",
                href: "/playground/streams-api/session"
              })}>Session</a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></li> <li><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex justify-between items-center h-12 text-lg font-medium",
                href: "/playground/streams-api/simple-subscriber"
              })}>Simple Subscriber</a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></li></ul></section> <section class="flex flex-col"><span class="text-base mb-2 text-ds-gray-900">Derivatives API</span> <ul class="pl-2"><li><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex justify-between items-center h-12 text-lg font-medium",
                href: "/playground/options-api/brokerage"
              })}>Brokerage</a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></li> <li><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex justify-between items-center h-12 text-lg font-medium",
                href: "/playground/options-api/broker"
              })}>Broker</a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></li> <li><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex justify-between items-center h-12 text-lg font-medium",
                href: "/playground/options-api/brokerage-account"
              })}>Brokerage Account</a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></li> <li><!--[-->`;
          Close($$payload3, {
            asChild: true,
            children: ($$payload4, $$slotProps3) => {
              const builder = $$slotProps3.builder;
              $$payload4.out += `<a${spread_attributes({
                ...builder,
                class: "flex justify-between items-center h-12 text-lg font-medium",
                href: "/playground/options-api/cash-or-nothing-option"
              })}>Cash-or-Nothing Option</a>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--></li></ul></section></nav> <div class="pt-6"><!--[-->`;
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
          $$payload3.out += `<!--]--></div></div>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!--]--></div></div></header> <!--[-->`;
  children($$payload);
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-C5HDxVmx.js.map
