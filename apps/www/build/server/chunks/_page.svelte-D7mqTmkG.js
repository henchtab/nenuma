import { d as store_get, A as head, n as escape_html, u as unsubscribe_stores, b as pop, p as push, g as attr, t as copy_payload, w as assign_payload, z as stringify } from './index3-C3tkxEZ9.js';
import { h as hapticFeedback } from './tma-DWgLwTMy.js';
import { p as page } from './stores-BmSZLopb.js';
import { B as Button } from './index4-oP-Y0xSz.js';
import { d as createDataStream, g as createSimpleSubscriber, L as Label, I as Input } from './index5-8CER8S0e.js';
import './_sentry-release-injection-file-DnBzmPpn.js';
import { r as randomize } from './utils-Cu53aTbv.js';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import { o as onDestroy } from './ton-connect-Dy4dENFp.js';
import { d as derived, w as writable } from './index2-d8GdKNTl.js';
import './client-DxbLJQ2o.js';
import './utils2-CiK4tJ06.js';
import './misc-DisFbBK1.js';
import 'tailwind-variants';
import 'clsx';
import './constants-YcxnLy9M.js';
import '@ton/ton';
import '@tonconnect/ui';
import '@ton/core';
import 'tailwind-merge';
import './index-DmRbVFTk.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "881001c3-aef9-4e2c-90aa-087f3cfdbd4a", e._sentryDebugIdIdentifier = "sentry-dbid-881001c3-aef9-4e2c-90aa-087f3cfdbd4a");
  } catch (e2) {
  }
}();
function StreamForm($$payload, $$props) {
  push();
  createDataStream();
  let queryId = void 0;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<form class="flex container py-6 flex-col gap-4 overflow-auto"><div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Topic`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      type: "text",
      name: "topic",
      placeholder: "1.candlestick.TONUSDT",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "queryId",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Query ID`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="flex relative ring-1 ring-ds-gray-400 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-ds-gray-600"><!--[-->`;
    Input($$payload2, {
      id: "queryId",
      type: "number",
      name: "queryId",
      placeholder: "101",
      required: true,
      get value() {
        return queryId;
      },
      set value($$value) {
        queryId = $$value;
        $$settled = false;
      },
      class: "rounded-r-none border-0 border-r focus-visible:ring-0 appearance-none"
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Button($$payload2, {
      variant: "secondary",
      class: "text-sm rounded-l-none ring-0",
      onclick: () => queryId = randomize(),
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Randomize`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></div></div></form>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
function BatchForm($$payload, $$props) {
  push();
  var $$store_subs;
  const searchParams = store_get($$store_subs ??= {}, "$page", page).url.searchParams;
  const streamAddress = searchParams.get("streamAddress") || "";
  createDataStream(writable(streamAddress));
  let queryId = 0;
  onDestroy(() => {
  });
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<form class="flex container py-6 flex-col gap-4 overflow-auto"><div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "queryId",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Query ID`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="flex relative ring-1 ring-ds-gray-400 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-ds-gray-600"><!--[-->`;
    Input($$payload2, {
      id: "queryId",
      type: "number",
      name: "queryId",
      placeholder: "101",
      required: true,
      get value() {
        return queryId;
      },
      set value($$value) {
        queryId = $$value;
        $$settled = false;
      },
      class: "rounded-r-none border-0 border-r focus-visible:ring-0 appearance-none"
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Button($$payload2, {
      variant: "secondary",
      class: "text-sm rounded-l-none ring-0",
      onclick: () => queryId = randomize(),
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Randomize`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></div></div></form>`;
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
function SessionForm($$payload, $$props) {
  push();
  var $$store_subs;
  const searchParams = store_get($$store_subs ??= {}, "$page", page).url.searchParams;
  const streamAddress = searchParams.get("streamAddress") || "";
  createDataStream(writable(streamAddress));
  let queryId = 0;
  onDestroy(() => {
  });
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<form class="flex container py-6 flex-col gap-4 overflow-auto"><div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "queryId",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Query ID`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="flex relative ring-1 ring-ds-gray-400 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-ds-gray-600"><!--[-->`;
    Input($$payload2, {
      id: "queryId",
      type: "number",
      name: "queryId",
      placeholder: "101",
      required: true,
      get value() {
        return queryId;
      },
      set value($$value) {
        queryId = $$value;
        $$settled = false;
      },
      class: "rounded-r-none border-0 border-r focus-visible:ring-0 appearance-none"
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Button($$payload2, {
      variant: "secondary",
      class: "text-sm rounded-l-none ring-0",
      onclick: () => queryId = randomize(),
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Randomize`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></div></div></form>`;
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
function PublishCandlestickForm($$payload, $$props) {
  push();
  var $$store_subs;
  const searchParams = store_get($$store_subs ??= {}, "$page", page).url.searchParams;
  const streamAddress = searchParams.get("streamAddress") || "";
  createDataStream(writable(streamAddress));
  let queryId = 0;
  onDestroy(() => {
  });
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<form class="flex container py-6 flex-1 flex-col gap-4"><div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "start",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Start`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "start",
      type: "number",
      name: "start",
      placeholder: "1718207640",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "end",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `End`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "end",
      type: "number",
      name: "end",
      placeholder: "1718207699",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      id: "open",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Open`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "open",
      type: "number",
      name: "open",
      placeholder: "6969709",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "high",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `High`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "high",
      type: "number",
      name: "high",
      placeholder: "6969774",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "low",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Low`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "low",
      type: "number",
      name: "low",
      placeholder: "6970129",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "close",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Close`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "close",
      type: "number",
      name: "close",
      placeholder: "6966979",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "queryId",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Query ID`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="flex relative ring-1 ring-ds-gray-400 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-ds-gray-600"><!--[-->`;
    Input($$payload2, {
      id: "queryId",
      type: "number",
      name: "queryId",
      placeholder: "101",
      required: true,
      get value() {
        return queryId;
      },
      set value($$value) {
        queryId = $$value;
        $$settled = false;
      },
      class: "rounded-r-none border-0 border-r focus-visible:ring-0 appearance-none"
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Button($$payload2, {
      variant: "secondary",
      class: "text-sm rounded-l-none ring-0",
      onclick: () => queryId = randomize(),
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Randomize`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></div></div></form>`;
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
function SimpleSubscriberForm($$payload, $$props) {
  push();
  var $$store_subs;
  createSimpleSubscriber();
  let subscriberId = 0;
  onDestroy(() => {
  });
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<form class="flex container py-6 flex-col gap-4 overflow-auto"><div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      class: "flex flex-col gap-2",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Stream Address`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      type: "text",
      name: "stream",
      placeholder: "0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      class: "flex flex-col gap-2",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Notifications Count`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      type: "number",
      name: "notificationsCount",
      placeholder: "777",
      required: true,
      min: "0"
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "exp",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Expiration Time`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "exp",
      type: "datetime-local",
      name: "exp",
      required: true,
      onchange: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).selectionChanged()
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "subscriberId",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Subscriber ID`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="flex relative ring-1 ring-ds-gray-400 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-ds-gray-600"><!--[-->`;
    Input($$payload2, {
      id: "subscriberId",
      type: "number",
      name: "subscriberId",
      placeholder: "101",
      required: true,
      get value() {
        return subscriberId;
      },
      set value($$value) {
        subscriberId = $$value;
        $$settled = false;
      },
      class: "rounded-r-none border-0 border-r focus-visible:ring-0 appearance-none"
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Button($$payload2, {
      variant: "secondary",
      class: "text-sm rounded-l-none ring-0",
      onclick: () => subscriberId = randomize(),
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Randomize`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></div></div></form>`;
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
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const contractToComponent = {
    stream: StreamForm,
    batch: BatchForm,
    session: SessionForm,
    candlestick: PublishCandlestickForm,
    subscriber: SimpleSubscriberForm
  };
  const contractType = derived(page, ($page2) => {
    const type = $page2.url.searchParams.get("contract") || "stream";
    return type in contractToComponent ? type : "stream";
  });
  const title = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("title") || "Fill out the form";
  const subtitle = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("subtitle") || "";
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Deploy ${escape_html(title)}</title>`;
    $$payload2.out += `<meta name="description"${attr("content", `Fill out the form below to deploy your own ${stringify(subtitle)}.`)}> <meta name="robots" content="noindex, nofollow">`;
  });
  $$payload.out += `<div class="bg-ds-background-100 border-b"><div class="container py-6 grid gap-1.5"><h1 class="text-lg font-medium text-center text-balance">Deploy ${escape_html(title)}</h1> <p class="text-ds-gray-900 text-center text-balance">Fill out the form below to deploy your own ${escape_html(subtitle)}.</p></div></div> <!--[-->`;
  contractToComponent[store_get($$store_subs ??= {}, "$contractType", contractType)]?.($$payload, {});
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D7mqTmkG.js.map
