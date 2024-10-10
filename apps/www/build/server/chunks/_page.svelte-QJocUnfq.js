import { d as store_get, A as head, n as escape_html, u as unsubscribe_stores, b as pop, p as push, t as copy_payload, w as assign_payload, e as rest_props, v as value_or_fallback, j as bind_props, s as setContext, o as sanitize_props, l as spread_props, i as slot, q as getContext, h as spread_attributes } from './index3-C3tkxEZ9.js';
import { h as hapticFeedback } from './tma-DWgLwTMy.js';
import { p as page } from './stores-BmSZLopb.js';
import { B as Button, c as createBitAttrs, o as omit, m as makeElement, l as disabledAttr, i as isHTMLElement, e as executeCallbacks, a as addMeltEventListener, k as kbd, f as isBrowser, d as createElHelpers, n as noop } from './index4-oP-Y0xSz.js';
import { u as useBroker, b as createCashOrNothingOption, L as Label, I as Input } from './index5-8CER8S0e.js';
import './_sentry-release-injection-file-DnBzmPpn.js';
import { C as Chevron_down, T as Trending_up, a as Trending_down, b as arraysAreEqual, g as getElemDirection } from './trending-up-YEnm4n4v.js';
import { r as removeUndefined, g as getOptionUpdater, t as toWritableStores, o as overridable } from './updater-CjQ7rtaE.js';
import { d as derived, w as writable } from './index2-d8GdKNTl.js';
import { s as sleep } from './sleep-CMjvr8cL.js';
import { d as default_slot } from './misc-DisFbBK1.js';
import 'clsx';
import './constants-YcxnLy9M.js';
import { tv } from 'tailwind-variants';
import { f as formatTime, r as randomize, c as cn } from './utils-Cu53aTbv.js';
import '@ton/core';
import './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import './ton-connect-Dy4dENFp.js';
import './utils2-CiK4tJ06.js';
import './client-DxbLJQ2o.js';
import './index-DmRbVFTk.js';
import '@ton/ton';
import '@tonconnect/ui';
import './Icon-DC-Mh-BG.js';
import 'tailwind-merge';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "008ebcb0-8cd8-433d-9d1c-066766f87164", e._sentryDebugIdIdentifier = "sentry-dbid-008ebcb0-8cd8-433d-9d1c-066766f87164");
  } catch (e2) {
  }
}();
function handleRovingFocus(nextElement) {
  if (!isBrowser)
    return;
  sleep(1).then(() => {
    const currentFocusedElement = document.activeElement;
    if (!isHTMLElement(currentFocusedElement) || currentFocusedElement === nextElement)
      return;
    currentFocusedElement.tabIndex = -1;
    if (nextElement) {
      nextElement.tabIndex = 0;
      nextElement.focus();
    }
  });
}
const defaults = {
  type: "single",
  orientation: "horizontal",
  loop: true,
  rovingFocus: true,
  disabled: false,
  defaultValue: ""
};
const { name, selector } = createElHelpers("toggle-group");
const createToggleGroup = (props) => {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(withDefaults, "value"));
  const { type, orientation, loop, rovingFocus, disabled } = options;
  const defaultValue = withDefaults.defaultValue ? withDefaults.defaultValue : withDefaults.type === "single" ? void 0 : [];
  const valueWritable = withDefaults.value ?? writable(defaultValue);
  const value = overridable(valueWritable, withDefaults?.onValueChange);
  const root = makeElement(name(), {
    stores: orientation,
    returned: ($orientation) => {
      return {
        role: "group",
        "data-orientation": $orientation
      };
    }
  });
  const item = makeElement(name("item"), {
    stores: [value, disabled, orientation, type],
    returned: ([$value, $disabled, $orientation, $type]) => {
      return (props2) => {
        const itemValue = typeof props2 === "string" ? props2 : props2.value;
        const argDisabled = typeof props2 === "string" ? false : !!props2.disabled;
        const disabled2 = $disabled || argDisabled;
        const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
        const isSingle = $type === "single";
        const isMultiple = $type === "multiple" || $type === void 0;
        return {
          disabled: disabledAttr(disabled2),
          pressed,
          "data-orientation": $orientation,
          "data-disabled": disabledAttr(disabled2),
          "data-state": pressed ? "on" : "off",
          "data-value": itemValue,
          "aria-pressed": isMultiple ? pressed : void 0,
          "aria-checked": isSingle ? pressed : void 0,
          type: "button",
          role: isSingle ? "radio" : void 0,
          tabindex: pressed ? 0 : -1
        };
      };
    },
    action: (node) => {
      let unsub = noop;
      const parentGroup = node.closest(selector());
      if (!isHTMLElement(parentGroup))
        return {};
      const items = Array.from(parentGroup.querySelectorAll(selector("item")));
      const $value = value.get();
      const anyPressed = Array.isArray($value) ? $value.length > 0 : $value ? true : false;
      if (!anyPressed && items[0] === node) {
        node.tabIndex = 0;
      }
      function getNodeProps() {
        const itemValue = node.dataset.value;
        const disabled2 = node.dataset.disabled === "true";
        return { value: itemValue, disabled: disabled2 };
      }
      function handleValueUpdate() {
        const { value: itemValue, disabled: disabled2 } = getNodeProps();
        if (itemValue === void 0 || disabled2)
          return;
        value.update(($value2) => {
          if (Array.isArray($value2)) {
            if ($value2.includes(itemValue)) {
              return $value2.filter((i) => i !== itemValue);
            }
            return [...$value2, itemValue];
          }
          return $value2 === itemValue ? void 0 : itemValue;
        });
      }
      unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        handleValueUpdate();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
          e.preventDefault();
          handleValueUpdate();
          return;
        }
        if (!rovingFocus.get())
          return;
        const el = e.currentTarget;
        if (!isHTMLElement(el))
          return;
        const root2 = el.closest(selector());
        if (!isHTMLElement(root2))
          return;
        const items2 = Array.from(root2.querySelectorAll(selector("item") + ":not([data-disabled])")).filter((item2) => isHTMLElement(item2));
        const currentIndex = items2.indexOf(el);
        const dir = getElemDirection(el);
        const $orientation = orientation.get();
        const nextKey = {
          horizontal: dir === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
          vertical: kbd.ARROW_DOWN
        }[$orientation ?? "horizontal"];
        const prevKey = {
          horizontal: dir === "rtl" ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
          vertical: kbd.ARROW_UP
        }[$orientation ?? "horizontal"];
        const $loop = loop.get();
        if (e.key === nextKey) {
          e.preventDefault();
          const nextIndex = currentIndex + 1;
          if (nextIndex >= items2.length && $loop) {
            handleRovingFocus(items2[0]);
          } else {
            handleRovingFocus(items2[nextIndex]);
          }
        } else if (e.key === prevKey) {
          e.preventDefault();
          const prevIndex = currentIndex - 1;
          if (prevIndex < 0 && $loop) {
            handleRovingFocus(items2[items2.length - 1]);
          } else {
            handleRovingFocus(items2[prevIndex]);
          }
        } else if (e.key === kbd.HOME) {
          e.preventDefault();
          handleRovingFocus(items2[0]);
        } else if (e.key === kbd.END) {
          e.preventDefault();
          handleRovingFocus(items2[items2.length - 1]);
        }
      }));
      return {
        destroy: unsub
      };
    }
  });
  const isPressed = derived(value, ($value) => {
    return (itemValue) => {
      return Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
    };
  });
  return {
    elements: {
      root,
      item
    },
    states: {
      value
    },
    helpers: {
      isPressed
    },
    options
  };
};
function getToggleGroupData() {
  const NAME = "toggle-group";
  const PARTS = ["root", "item"];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getToggleGroupData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const toggleGroup = { ...createToggleGroup(removeUndefined(props)), getAttrs };
  setContext(NAME, toggleGroup);
  return {
    ...toggleGroup,
    updateOption: getOptionUpdater(toggleGroup.options)
  };
}
function getCtx() {
  const { NAME } = getToggleGroupData();
  return getContext(NAME);
}
function Toggle_group$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "type",
    "disabled",
    "loop",
    "value",
    "orientation",
    "onValueChange",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let type = value_or_fallback($$props["type"], () => "single");
  let disabled = value_or_fallback($$props["disabled"], () => void 0);
  let loop = value_or_fallback($$props["loop"], () => void 0);
  let value = value_or_fallback($$props["value"], () => void 0);
  let orientation = value_or_fallback($$props["orientation"], () => void 0);
  let onValueChange = value_or_fallback($$props["onValueChange"], () => void 0);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const {
    elements: { root },
    states: { value: localValue },
    updateOption,
    getAttrs
  } = setCtx({
    disabled,
    type,
    defaultValue: value,
    loop,
    orientation,
    onValueChange: ({ next }) => {
      if (Array.isArray(next)) {
        if (!Array.isArray(value) || !arraysAreEqual(value, next)) {
          onValueChange?.(next);
          value = next;
          return next;
        }
        return next;
      }
      if (value !== next) {
        onValueChange?.(next);
        value = next;
      }
      return next;
    }
  });
  const attrs = getAttrs("root");
  value !== void 0 && localValue.set(Array.isArray(value) ? [...value] : value);
  updateOption("disabled", disabled);
  updateOption("loop", loop);
  updateOption("type", type);
  updateOption("orientation", orientation);
  builder = store_get($$store_subs ??= {}, "$root", root);
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]--></div>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    type,
    disabled,
    loop,
    value,
    orientation,
    onValueChange,
    asChild,
    el
  });
  pop();
}
function Toggle_group_item$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["value", "disabled", "asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let value = $$props["value"];
  let disabled = value_or_fallback($$props["disabled"], () => false);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { item }, getAttrs } = getCtx();
  const attrs = getAttrs("item");
  builder = store_get($$store_subs ??= {}, "$item", item)({ value, disabled });
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<button${spread_attributes({ ...builder, ...$$restProps })}><!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]--></button>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { value, disabled, asChild, el });
  pop();
}
function Toggle_group($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "variant", "size", "value"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let variant = value_or_fallback($$props["variant"], () => "default");
  let size = value_or_fallback($$props["size"], () => "default");
  let value = value_or_fallback($$props["value"], () => void 0);
  setToggleGroupCtx({ variant, size });
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Toggle_group$1($$payload2, spread_props([
      {
        class: cn("flex items-center border rounded-md w-fit justify-center", className),
        get value() {
          return value;
        },
        set value($$value) {
          value = $$value;
          $$settled = false;
        }
      },
      $$restProps,
      {
        children: ($$payload3, $$slotProps) => {
          const builder = $$slotProps.builder;
          $$payload3.out += `<!--[-->`;
          slot(
            $$payload3,
            default_slot($$props),
            {
              get builder() {
                return builder;
              }
            },
            null
          );
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { class: className, variant, size, value });
  pop();
}
const toggleVariants = tv({
  base: "inline-flex items-center border-r first:rounded-l-md last:border-r-0 last:rounded-r-md justify-center text-sm font-medium transition-colors hover:bg-ds-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-gray-600 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-ds-blue-200 data-[state=on]:text-ds-blue-900",
  variants: {
    variant: {
      default: "bg-transparent"
    },
    size: {
      default: "h-9 px-3",
      sm: "h-8 px-2",
      lg: "h-10 px-3"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
function Toggle_group_item($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "variant", "size", "value"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let variant = value_or_fallback($$props["variant"], () => "default");
  let size = value_or_fallback($$props["size"], () => "default");
  let value = $$props["value"];
  const ctx = getToggleGroupCtx();
  $$payload.out += `<!--[-->`;
  Toggle_group_item$1($$payload, spread_props([
    {
      class: cn(
        toggleVariants({
          variant: ctx.variant || variant,
          size: ctx.size || size
        }),
        className
      ),
      value
    },
    $$restProps,
    {
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `<!--[-->`;
        slot($$payload2, default_slot($$props), {}, null);
        $$payload2.out += `<!--]-->`;
      },
      $$slots: { default: true }
    }
  ]));
  $$payload.out += `<!--]-->`;
  bind_props($$props, { class: className, variant, size, value });
  pop();
}
function setToggleGroupCtx(props) {
  setContext("toggleGroup", props);
}
function getToggleGroupCtx() {
  return getContext("toggleGroup");
}
function BrokerOptionForm($$payload, $$props) {
  push();
  var $$store_subs;
  const searchParams = store_get($$store_subs ??= {}, "$page", page).url.searchParams;
  const brokerAddress = searchParams.get("broker") || "";
  useBroker(writable(brokerAddress));
  let queryId = void 0;
  let initiation = initiationTime(3);
  let optionType = void 0;
  function initiationTime(numberOfMinutes) {
    return formatTime(new Date(Date.now() + 1e3 * 60 * numberOfMinutes));
  }
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
    $$payload2.out += `<!--]--></div></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "holder",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Holder`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "holder",
      type: "text",
      name: "holder",
      placeholder: "0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "initiation",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Initiation`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "initiation",
      type: "time",
      name: "initiation",
      min: initiation,
      get value() {
        return initiation;
      },
      set value($$value) {
        initiation = $$value;
        $$settled = false;
      },
      required: true,
      onchange: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).selectionChanged()
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "expiration",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Expiration`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="relative flex items-center"><select class="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ds-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-gray-600 disabled:cursor-not-allowed disabled:opacity-50 appearance-none" id="expiration" name="expiration" required><option value="2">2 minutes</option><option value="3">3 minutes</option><option value="4">4 minutes</option><option value="5">5 minutes</option></select> <!--[-->`;
    Chevron_down($$payload2, {
      size: 16,
      "stroke-width": 1.5,
      class: "absolute right-2 text-ds-gray-900"
    });
    $$payload2.out += `<!--]--></div></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "optionType",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Option Type`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Toggle_group($$payload2, {
      type: "single",
      id: "optionType",
      "aria-required": true,
      get value() {
        return optionType;
      },
      set value($$value) {
        optionType = $$value;
        $$settled = false;
      },
      onValueChange: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).selectionChanged(),
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Toggle_group_item($$payload3, {
          value: "true",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `<!--[-->`;
            Trending_up($$payload4, { size: 16, "stroke-width": 1.5, class: "mr-2" });
            $$payload4.out += `<!--]--> Call`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Toggle_group_item($$payload3, {
          value: "false",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `<!--[-->`;
            Trending_down($$payload4, { size: 16, "stroke-width": 1.5, class: "mr-2" });
            $$payload4.out += `<!--]--> Put`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]-->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "investment",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Investment`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="relative flex items-center"><!--[-->`;
    Input($$payload2, {
      class: "pr-12",
      id: "investment",
      type: "number",
      name: "investment",
      placeholder: "100",
      step: "any",
      required: true
    });
    $$payload2.out += `<!--]--> <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span></div></div></form>`;
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
function BrokerDepositForm($$payload, $$props) {
  push();
  var $$store_subs;
  const searchParams = store_get($$store_subs ??= {}, "$page", page).url.searchParams;
  const brokerAddress = searchParams.get("broker") || "";
  useBroker(writable(brokerAddress));
  let queryId = void 0;
  initiationTime(3);
  function initiationTime(numberOfMinutes) {
    return formatTime(new Date(Date.now() + 1e3 * 60 * numberOfMinutes));
  }
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
    $$payload2.out += `<!--]--></div></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "deposit",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Deposit`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="relative flex items-center"><!--[-->`;
    Input($$payload2, {
      class: "pr-12",
      id: "deposit",
      type: "number",
      name: "deposit",
      placeholder: "100",
      step: "any",
      required: true
    });
    $$payload2.out += `<!--]--> <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span></div></div></form>`;
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
function OptionForm($$payload, $$props) {
  push();
  var $$store_subs;
  const searchParams = store_get($$store_subs ??= {}, "$page", page).url.searchParams;
  const stream = searchParams.get("stream") || "";
  createCashOrNothingOption(writable(stream));
  let writer = void 0;
  let optionId = void 0;
  let queryId = void 0;
  let initiation = initiationTime(3);
  let optionType = void 0;
  function initiationTime(numberOfMinutes) {
    return formatTime(new Date(Date.now() + 1e3 * 60 * numberOfMinutes));
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<form class="flex container py-6 flex-col gap-4 overflow-auto"><div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "optionId",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Option ID`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="flex relative ring-1 ring-ds-gray-400 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-ds-gray-600"><!--[-->`;
    Input($$payload2, {
      id: "optionId",
      type: "number",
      name: "optionId",
      placeholder: "101",
      required: true,
      get value() {
        return optionId;
      },
      set value($$value) {
        optionId = $$value;
        $$settled = false;
      },
      class: "rounded-r-none border-0 border-r focus-visible:ring-0 appearance-none"
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Button($$payload2, {
      variant: "secondary",
      class: "text-sm rounded-l-none ring-0",
      onclick: () => optionId = randomize(),
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Randomize`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></div></div> <div class="grid gap-2"><!--[-->`;
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
    $$payload2.out += `<!--]--></div></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "holder",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Holder`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "holder",
      type: "text",
      name: "holder",
      placeholder: "0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "writer",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Writer`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "writer",
      type: "text",
      name: "writer",
      get value() {
        return writer;
      },
      set value($$value) {
        writer = $$value;
        $$settled = false;
      },
      placeholder: "0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV",
      required: true
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "initiation",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Initiation`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Input($$payload2, {
      id: "initiation",
      type: "time",
      name: "initiation",
      min: initiation,
      get value() {
        return initiation;
      },
      set value($$value) {
        initiation = $$value;
        $$settled = false;
      },
      required: true,
      onchange: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).selectionChanged()
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "expiration",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Expiration`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="relative flex items-center"><select class="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ds-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-gray-600 disabled:cursor-not-allowed disabled:opacity-50 appearance-none" id="expiration" name="expiration" required><option value="2">2 minutes</option><option value="3">3 minutes</option><option value="4">4 minutes</option><option value="5">5 minutes</option></select> <!--[-->`;
    Chevron_down($$payload2, {
      size: 16,
      "stroke-width": 1.5,
      class: "absolute right-2 text-ds-gray-900"
    });
    $$payload2.out += `<!--]--></div></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "optionType",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Option Type`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Toggle_group($$payload2, {
      type: "single",
      id: "optionType",
      "aria-required": true,
      get value() {
        return optionType;
      },
      set value($$value) {
        optionType = $$value;
        $$settled = false;
      },
      onValueChange: () => store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).selectionChanged(),
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Toggle_group_item($$payload3, {
          value: "true",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `<!--[-->`;
            Trending_up($$payload4, { size: 16, "stroke-width": 1.5, class: "mr-2" });
            $$payload4.out += `<!--]--> Call`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Toggle_group_item($$payload3, {
          value: "false",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `<!--[-->`;
            Trending_down($$payload4, { size: 16, "stroke-width": 1.5, class: "mr-2" });
            $$payload4.out += `<!--]--> Put`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!--]-->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "investment",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Investment`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="relative flex items-center"><!--[-->`;
    Input($$payload2, {
      class: "pr-12",
      id: "investment",
      type: "number",
      name: "investment",
      placeholder: "100",
      step: "any",
      required: true
    });
    $$payload2.out += `<!--]--> <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span></div></div> <div class="grid gap-2"><!--[-->`;
    Label($$payload2, {
      for: "payout",
      class: "w-fit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `Payout`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <div class="relative flex items-center"><!--[-->`;
    Input($$payload2, {
      class: "pr-12",
      id: "payout",
      type: "number",
      name: "payout",
      placeholder: "100",
      step: "any",
      required: true
    });
    $$payload2.out += `<!--]--> <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span></div></div></form>`;
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
    brokerOption: BrokerOptionForm,
    brokerDeposit: BrokerDepositForm,
    option: OptionForm
  };
  const contractType = derived(page, ($page2) => {
    const type = $page2.url.searchParams.get("contract") || "option";
    return type in contractToComponent ? type : "option";
  });
  const title = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("title") || "Fill out the form";
  store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("subtitle") || "";
  const shouldForceTitle = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("forceTitle") === "true";
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
    ${escape_html(shouldForceTitle ? title : `Deploy ${title}`)}
  </title>`;
    $$payload2.out += `<meta name="robots" content="noindex, nofollow">`;
  });
  $$payload.out += `<div class="bg-ds-background-100 border-b"><div class="container py-6 grid gap-1.5"><h1 class="text-lg font-medium text-center text-balance">${escape_html(shouldForceTitle ? title : `Deploy ${title}`)}</h1> <p class="text-ds-gray-900 text-center text-balance">Fill out the form below</p></div></div> <!--[-->`;
  contractToComponent[store_get($$store_subs ??= {}, "$contractType", contractType)]?.($$payload, {});
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-QJocUnfq.js.map
