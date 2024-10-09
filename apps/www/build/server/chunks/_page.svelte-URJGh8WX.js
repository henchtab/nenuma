import { s as setContext, d as store_get, u as unsubscribe_stores, b as pop, e as rest_props, p as push, v as value_or_fallback, l as spread_props, i as slot, j as bind_props, h as spread_attributes, q as getContext, t as copy_payload, w as assign_payload, n as escape_html, o as sanitize_props, g as attr, z as stringify, f as ensure_array_like, y as element } from './index3-C3tkxEZ9.js';
import { B as Button, c as createBitAttrs, o as omit, m as makeElement, d as createElHelpers, l as disabledAttr, e as executeCallbacks, a as addMeltEventListener, f as isBrowser, k as kbd, q as getElementByMeltId, i as isHTMLElement, s as styleToString, r as getDirectionalKeys } from './index4-C3ooMKJa.js';
import { c as createQuery, s as shortenAddress, g as generateIds, n as next, p as prev, l as last, a as generateId } from './shorten-address-CTjfG0vA.js';
import { C as Chevron_down, T as Trending_up, a as Trending_down, b as arraysAreEqual, g as getElemDirection } from './trending-up-YEnm4n4v.js';
import { r as removeUndefined, g as getOptionUpdater, t as toWritableStores, o as overridable } from './updater-Yp3EDSxH.js';
import { w as writable, d as derived } from './index2-d8GdKNTl.js';
import { d as default_slot } from './misc-DisFbBK1.js';
import 'clsx';
import { T as TON_CONNECT_UI_CONTEXT } from './constants-u-0RYjcS.js';
import { h as hapticFeedback } from './tma-CBfk33he.js';
import './_sentry-release-injection-file-B-U-aYmd.js';
import { p as page } from './stores-Bw-ArpGG.js';
import 'lightweight-charts';
import { a as PUBLIC_BROKER_ADDRESS, P as PUBLIC_API_URL } from './public-BCOIycai.js';
import { u as useBroker, L as Label, I as Input } from './index5-CbGI2GMt.js';
import { c as cn, f as formatTime } from './utils-h3ohtT7M.js';
import { I as Icon } from './Icon-DC-Mh-BG.js';
import { l as latestPrices } from './ws.svelte-DPYrg93G.js';
import { i as isConnected, b as tick } from './ton-connect-B_eqdS4i.js';
import '@ton/core';
import 'posthog-js';
import { tv } from 'tailwind-variants';
import { fromNano } from '@ton/ton';
import './utils2-CiK4tJ06.js';
import './context-DhSgOhFj.js';
import './client-BzTKQ2Ic.js';
import './index-DmRbVFTk.js';
import '@tonconnect/ui';
import 'tailwind-merge';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "3da0154c-f2d9-4b39-82a6-b0f3c49e28a8", e._sentryDebugIdIdentifier = "sentry-dbid-3da0154c-f2d9-4b39-82a6-b0f3c49e28a8");
  } catch (e2) {
  }
}();
const { name: name$1, selector: selector$1 } = createElHelpers("accordion");
const defaults$1 = {
  multiple: false,
  disabled: false,
  forceVisible: false
};
const createAccordion = (props) => {
  const withDefaults = { ...defaults$1, ...props };
  const options = toWritableStores(omit(withDefaults, "value", "onValueChange", "defaultValue"));
  const meltIds = generateIds(["root"]);
  const { disabled, forceVisible } = options;
  const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
  const value = overridable(valueWritable, withDefaults?.onValueChange);
  const isSelected = (key, v) => {
    if (v === void 0)
      return false;
    if (typeof v === "string")
      return v === key;
    return v.includes(key);
  };
  const isSelectedStore = derived(value, ($value) => {
    return (key) => isSelected(key, $value);
  });
  const root = makeElement(name$1(), {
    returned: () => ({
      "data-melt-id": meltIds.root
    })
  });
  const parseItemProps = (props2) => {
    if (typeof props2 === "string") {
      return { value: props2 };
    } else {
      return props2;
    }
  };
  const parseHeadingProps = (props2) => {
    if (typeof props2 === "number") {
      return { level: props2 };
    } else {
      return props2;
    }
  };
  const item = makeElement(name$1("item"), {
    stores: value,
    returned: ($value) => {
      return (props2) => {
        const { value: itemValue, disabled: disabled2 } = parseItemProps(props2);
        return {
          "data-state": isSelected(itemValue, $value) ? "open" : "closed",
          "data-disabled": disabledAttr(disabled2)
        };
      };
    }
  });
  const trigger = makeElement(name$1("trigger"), {
    stores: [value, disabled],
    returned: ([$value, $disabled]) => {
      return (props2) => {
        const { value: itemValue, disabled: disabled2 } = parseItemProps(props2);
        return {
          disabled: disabledAttr($disabled || disabled2),
          "aria-expanded": isSelected(itemValue, $value) ? true : false,
          "aria-disabled": disabled2 ? true : false,
          "data-disabled": disabledAttr(disabled2),
          "data-value": itemValue,
          "data-state": isSelected(itemValue, $value) ? "open" : "closed"
        };
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        const disabled2 = node.dataset.disabled === "true";
        const itemValue = node.dataset.value;
        if (disabled2 || !itemValue)
          return;
        handleValueUpdate(itemValue);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (![kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END].includes(e.key)) {
          return;
        }
        e.preventDefault();
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
          const disabled2 = node.dataset.disabled === "true";
          const itemValue = node.dataset.value;
          if (disabled2 || !itemValue)
            return;
          handleValueUpdate(itemValue);
          return;
        }
        const el = e.target;
        const rootEl = getElementByMeltId(meltIds.root);
        if (!rootEl || !isHTMLElement(el))
          return;
        const items = Array.from(rootEl.querySelectorAll(selector$1("trigger")));
        const candidateItems = items.filter((item2) => {
          if (!isHTMLElement(item2))
            return false;
          return item2.dataset.disabled !== "true";
        });
        if (!candidateItems.length)
          return;
        const elIdx = candidateItems.indexOf(el);
        if (e.key === kbd.ARROW_DOWN) {
          candidateItems[(elIdx + 1) % candidateItems.length].focus();
        }
        if (e.key === kbd.ARROW_UP) {
          candidateItems[(elIdx - 1 + candidateItems.length) % candidateItems.length].focus();
        }
        if (e.key === kbd.HOME) {
          candidateItems[0].focus();
        }
        if (e.key === kbd.END) {
          candidateItems[candidateItems.length - 1].focus();
        }
      }));
      return {
        destroy: unsub
      };
    }
  });
  const content = makeElement(name$1("content"), {
    stores: [value, disabled, forceVisible],
    returned: ([$value, $disabled, $forceVisible]) => {
      return (props2) => {
        const { value: itemValue } = parseItemProps(props2);
        const isVisible = isSelected(itemValue, $value) || $forceVisible;
        return {
          "data-state": isVisible ? "open" : "closed",
          "data-disabled": disabledAttr($disabled),
          "data-value": itemValue,
          hidden: isVisible ? void 0 : true,
          style: styleToString({
            display: isVisible ? void 0 : "none"
          })
        };
      };
    },
    action: (node) => {
      tick().then(() => {
        const contentId = generateId();
        const triggerId = generateId();
        const parentTrigger = document.querySelector(`${selector$1("trigger")}, [data-value="${node.dataset.value}"]`);
        if (!isHTMLElement(parentTrigger))
          return;
        node.id = contentId;
        parentTrigger.setAttribute("aria-controls", contentId);
        parentTrigger.id = triggerId;
      });
    }
  });
  const heading = makeElement(name$1("heading"), {
    returned: () => {
      return (props2) => {
        const { level } = parseHeadingProps(props2);
        return {
          role: "heading",
          "aria-level": level,
          "data-heading-level": level
        };
      };
    }
  });
  function handleValueUpdate(itemValue) {
    value.update(($value) => {
      if ($value === void 0) {
        return withDefaults.multiple ? [itemValue] : itemValue;
      }
      if (Array.isArray($value)) {
        if ($value.includes(itemValue)) {
          return $value.filter((v) => v !== itemValue);
        }
        $value.push(itemValue);
        return $value;
      }
      return $value === itemValue ? void 0 : itemValue;
    });
  }
  return {
    ids: meltIds,
    elements: {
      root,
      item,
      trigger,
      content,
      heading
    },
    states: {
      value
    },
    helpers: {
      isSelected: isSelectedStore
    },
    options
  };
};
const defaults = {
  orientation: "horizontal",
  activateOnFocus: true,
  loop: true,
  autoSet: true
};
const { name, selector } = createElHelpers("tabs");
function createTabs(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(withDefaults, "defaultValue", "value", "onValueChange", "autoSet"));
  const { orientation, activateOnFocus, loop } = options;
  const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
  const value = overridable(valueWritable, withDefaults?.onValueChange);
  let ssrValue = withDefaults.defaultValue ?? value.get();
  const root = makeElement(name(), {
    stores: orientation,
    returned: ($orientation) => {
      return {
        "data-orientation": $orientation
      };
    }
  });
  const list = makeElement(name("list"), {
    stores: orientation,
    returned: ($orientation) => {
      return {
        role: "tablist",
        "aria-orientation": $orientation,
        "data-orientation": $orientation
      };
    }
  });
  const parseTriggerProps = (props2) => {
    if (typeof props2 === "string") {
      return { value: props2 };
    } else {
      return props2;
    }
  };
  const trigger = makeElement(name("trigger"), {
    stores: [value, orientation],
    returned: ([$value, $orientation]) => {
      return (props2) => {
        const { value: tabValue, disabled } = parseTriggerProps(props2);
        if (!$value && !ssrValue && withDefaults.autoSet) {
          ssrValue = tabValue;
          $value = tabValue;
          value.set(tabValue);
        }
        const sourceOfTruth = isBrowser ? $value : ssrValue;
        const isActive = sourceOfTruth === tabValue;
        return {
          type: "button",
          role: "tab",
          "data-state": isActive ? "active" : "inactive",
          tabindex: isActive ? 0 : -1,
          "data-value": tabValue,
          "data-orientation": $orientation,
          "data-disabled": disabledAttr(disabled),
          disabled: disabledAttr(disabled)
        };
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "focus", () => {
        const disabled = node.dataset.disabled === "true";
        const tabValue = node.dataset.value;
        if (activateOnFocus.get() && !disabled && tabValue !== void 0) {
          value.set(tabValue);
        }
      }), addMeltEventListener(node, "click", (e) => {
        node.focus();
        e.preventDefault();
        const disabled = node.dataset.disabled === "true";
        if (disabled)
          return;
        const tabValue = node.dataset.value;
        node.focus();
        if (tabValue !== void 0) {
          value.set(tabValue);
        }
      }), addMeltEventListener(node, "keydown", (e) => {
        const tabValue = node.dataset.value;
        if (!tabValue)
          return;
        const el = e.currentTarget;
        if (!isHTMLElement(el))
          return;
        const rootEl = el.closest(selector());
        if (!isHTMLElement(rootEl))
          return;
        const $loop = loop.get();
        const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]')).filter((trigger2) => isHTMLElement(trigger2));
        const enabledTriggers = triggers.filter((el2) => !el2.hasAttribute("data-disabled"));
        const triggerIdx = enabledTriggers.findIndex((el2) => el2 === e.target);
        const dir = getElemDirection(rootEl);
        const { nextKey, prevKey } = getDirectionalKeys(dir, orientation.get());
        if (e.key === nextKey) {
          e.preventDefault();
          const nextEl = next(enabledTriggers, triggerIdx, $loop);
          nextEl.focus();
        } else if (e.key === prevKey) {
          e.preventDefault();
          const prevEl = prev(enabledTriggers, triggerIdx, $loop);
          prevEl.focus();
        } else if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
          e.preventDefault();
          value.set(tabValue);
        } else if (e.key === kbd.HOME) {
          e.preventDefault();
          const firstTrigger = enabledTriggers[0];
          firstTrigger.focus();
        } else if (e.key === kbd.END) {
          e.preventDefault();
          const lastTrigger = last(enabledTriggers);
          lastTrigger.focus();
        }
      }));
      return {
        destroy: unsub
      };
    }
  });
  const content = makeElement(name("content"), {
    stores: value,
    returned: ($value) => {
      return (tabValue) => {
        return {
          role: "tabpanel",
          // TODO: improve
          "aria-labelledby": tabValue,
          hidden: isBrowser ? $value === tabValue ? void 0 : true : ssrValue === tabValue ? void 0 : true,
          tabindex: 0
        };
      };
    }
  });
  return {
    elements: {
      root,
      list,
      trigger,
      content
    },
    states: {
      value
    },
    options
  };
}
function getAccordionData() {
  const NAME = "accordion";
  const ITEM_NAME = "accordion-item";
  const PARTS = ["root", "content", "header", "item", "trigger"];
  return { NAME, ITEM_NAME, PARTS };
}
function setCtx$1(props) {
  const initAccordion = createAccordion(removeUndefined(props));
  const { NAME, PARTS } = getAccordionData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const accordion = {
    ...initAccordion,
    getAttrs,
    updateOption: getOptionUpdater(initAccordion.options)
  };
  setContext(NAME, accordion);
  return accordion;
}
function getCtx$1() {
  const { NAME } = getAccordionData();
  return getContext(NAME);
}
function setItem(props) {
  const { ITEM_NAME } = getAccordionData();
  setContext(ITEM_NAME, { ...props });
  const ctx = getCtx$1();
  return { ...ctx, props };
}
function getItemProps() {
  const { ITEM_NAME } = getAccordionData();
  return getContext(ITEM_NAME);
}
function getContent() {
  const ctx = getCtx$1();
  const { value: props } = getItemProps();
  return {
    ...ctx,
    props
  };
}
function getTrigger() {
  const ctx = getCtx$1();
  const { value, disabled } = getItemProps();
  return {
    ...ctx,
    props: { value, disabled }
  };
}
function Accordion($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "multiple",
    "value",
    "onValueChange",
    "disabled",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let multiple = value_or_fallback($$props["multiple"], () => false);
  let value = value_or_fallback($$props["value"], () => void 0);
  let onValueChange = value_or_fallback($$props["onValueChange"], () => void 0);
  let disabled = value_or_fallback($$props["disabled"], () => false);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const {
    elements: { root },
    states: { value: localValue },
    updateOption,
    getAttrs
  } = setCtx$1({
    multiple,
    disabled,
    defaultValue: value,
    onValueChange: ({ next: next2 }) => {
      if (Array.isArray(next2)) {
        if (!Array.isArray(value) || !arraysAreEqual(value, next2)) {
          onValueChange?.(next2);
          value = next2;
          return next2;
        }
        return next2;
      }
      if (value !== next2) {
        onValueChange?.(next2);
        value = next2;
      }
      return next2;
    }
  });
  const attrs = getAttrs("root");
  value !== void 0 && localValue.set(Array.isArray(value) ? [...value] : value);
  updateOption("multiple", multiple);
  updateOption("disabled", disabled);
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
    multiple,
    value,
    onValueChange,
    disabled,
    asChild,
    el
  });
  pop();
}
function Accordion_item$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["value", "disabled", "asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let value = $$props["value"];
  let disabled = value_or_fallback($$props["disabled"], () => void 0);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { item }, props, getAttrs } = setItem({ value, disabled });
  const attrs = getAttrs("item");
  builder = store_get($$store_subs ??= {}, "$item", item)(props);
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
  bind_props($$props, { value, disabled, asChild, el });
  pop();
}
function Accordion_header($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["level", "asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let level = value_or_fallback($$props["level"], () => 3);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { heading: header }, getAttrs } = getCtx$1();
  const attrs = getAttrs("header");
  builder = store_get($$store_subs ??= {}, "$header", header)(level);
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
  bind_props($$props, { level, asChild, el });
  pop();
}
function Accordion_trigger$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { trigger }, props, getAttrs } = getTrigger();
  const attrs = getAttrs("trigger");
  builder = store_get($$store_subs ??= {}, "$trigger", trigger)(props);
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
    $$payload.out += `<button${spread_attributes({ ...builder, type: "button", ...$$restProps })}><!--[-->`;
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
  bind_props($$props, { asChild, el });
  pop();
}
function Accordion_content$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let transition = value_or_fallback($$props["transition"], () => void 0);
  let transitionConfig = value_or_fallback($$props["transitionConfig"], () => void 0);
  let inTransition = value_or_fallback($$props["inTransition"], () => void 0);
  let inTransitionConfig = value_or_fallback($$props["inTransitionConfig"], () => void 0);
  let outTransition = value_or_fallback($$props["outTransition"], () => void 0);
  let outTransitionConfig = value_or_fallback($$props["outTransitionConfig"], () => void 0);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const {
    elements: { content },
    helpers: { isSelected },
    props,
    getAttrs
  } = getContent();
  const attrs = getAttrs("content");
  builder = store_get($$store_subs ??= {}, "$content", content)(props);
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild && store_get($$store_subs ??= {}, "$isSelected", isSelected)(props)) {
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
    $$payload.out += `<!--[-->`;
    if (transition && store_get($$store_subs ??= {}, "$isSelected", isSelected)(props)) {
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
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += `<!--[-->`;
      if (inTransition && outTransition && store_get($$store_subs ??= {}, "$isSelected", isSelected)(props)) {
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
        $$payload.out += "<!--]-->";
      } else {
        $$payload.out += `<!--[-->`;
        if (inTransition && store_get($$store_subs ??= {}, "$isSelected", isSelected)(props)) {
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
          $$payload.out += "<!--]-->";
        } else {
          $$payload.out += `<!--[-->`;
          if (outTransition && store_get($$store_subs ??= {}, "$isSelected", isSelected)(props)) {
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
            $$payload.out += "<!--]-->";
          } else {
            $$payload.out += `<!--[-->`;
            if (store_get($$store_subs ??= {}, "$isSelected", isSelected)(props)) {
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
              $$payload.out += "<!--]-->";
            } else {
              $$payload.out += "<!--]!-->";
            }
            $$payload.out += "<!--]!-->";
          }
          $$payload.out += "<!--]!-->";
        }
        $$payload.out += "<!--]!-->";
      }
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    transition,
    transitionConfig,
    inTransition,
    inTransitionConfig,
    outTransition,
    outTransitionConfig,
    asChild,
    el
  });
  pop();
}
function getTabsData() {
  const NAME = "tabs";
  const PARTS = ["root", "content", "list", "trigger"];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getTabsData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const tabs = { ...createTabs(removeUndefined(props)), getAttrs };
  setContext(NAME, tabs);
  return {
    ...tabs,
    updateOption: getOptionUpdater(tabs.options)
  };
}
function getCtx() {
  const { NAME } = getTabsData();
  return getContext(NAME);
}
function Tabs($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "orientation",
    "activateOnFocus",
    "loop",
    "autoSet",
    "value",
    "onValueChange",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let orientation = value_or_fallback($$props["orientation"], () => void 0);
  let activateOnFocus = value_or_fallback($$props["activateOnFocus"], () => void 0);
  let loop = value_or_fallback($$props["loop"], () => void 0);
  let autoSet = value_or_fallback($$props["autoSet"], () => void 0);
  let value = value_or_fallback($$props["value"], () => void 0);
  let onValueChange = value_or_fallback($$props["onValueChange"], () => void 0);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const {
    elements: { root },
    states: { value: localValue },
    updateOption,
    getAttrs
  } = setCtx({
    orientation,
    activateOnFocus,
    loop,
    autoSet,
    defaultValue: value,
    onValueChange: ({ next: next2 }) => {
      if (value !== next2) {
        onValueChange?.(next2);
        value = next2;
      }
      return next2;
    }
  });
  const attrs = getAttrs("root");
  value !== void 0 && localValue.set(value);
  updateOption("orientation", orientation);
  updateOption("activateOnFocus", activateOnFocus);
  updateOption("loop", loop);
  updateOption("autoSet", autoSet);
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
        },
        get value() {
          return store_get($$store_subs ??= {}, "$localValue", localValue);
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
        },
        get value() {
          return store_get($$store_subs ??= {}, "$localValue", localValue);
        }
      },
      null
    );
    $$payload.out += `<!--]--></div>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    orientation,
    activateOnFocus,
    loop,
    autoSet,
    value,
    onValueChange,
    asChild,
    el
  });
  pop();
}
function Tabs_content$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["value", "asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let value = $$props["value"];
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { content }, getAttrs } = getCtx();
  const attrs = getAttrs("content");
  builder = store_get($$store_subs ??= {}, "$content", content)(value);
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
  bind_props($$props, { value, asChild, el });
  pop();
}
function Tabs_list$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { list }, getAttrs } = getCtx();
  const attrs = getAttrs("list");
  builder = store_get($$store_subs ??= {}, "$list", list);
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
  bind_props($$props, { asChild, el });
  pop();
}
function Tabs_trigger$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["value", "disabled", "asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let value = $$props["value"];
  let disabled = value_or_fallback($$props["disabled"], () => void 0);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { trigger }, getAttrs } = getCtx();
  const attrs = getAttrs("trigger");
  builder = store_get($$store_subs ??= {}, "$trigger", trigger)({ value, disabled });
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
    $$payload.out += `<button${spread_attributes({ ...builder, type: "button", ...$$restProps })}><!--[-->`;
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
function Info($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "info" },
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
function Microscope($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M6 18h8" }],
    ["path", { "d": "M3 22h18" }],
    ["path", { "d": "M14 22a7 7 0 1 0 0-14h-1" }],
    ["path", { "d": "M9 14h2" }],
    [
      "path",
      {
        "d": "M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"
      }
    ],
    [
      "path",
      { "d": "M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "microscope" },
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
function Tabs_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "value"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let value = $$props["value"];
  $$payload.out += `<!--[-->`;
  Tabs_content$1($$payload, spread_props([
    {
      class: cn("mt-2 ring-offset-ds-background-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-gray-400 focus-visible:ring-offset-2", className),
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
  bind_props($$props, { class: className, value });
  pop();
}
function Tabs_list($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<!--[-->`;
  Tabs_list$1($$payload, spread_props([
    {
      class: cn("inline-flex h-9 items-center justify-center rounded-lg bg-ds-gray-100 p-1 text-ds-gray-900", className)
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
  bind_props($$props, { class: className });
  pop();
}
function Tabs_trigger($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "value"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let value = $$props["value"];
  $$payload.out += `<!--[-->`;
  Tabs_trigger$1($$payload, spread_props([
    {
      class: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-ds-background-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-ds-background-100 data-[state=active]:text-ds-gray-1000 data-[state=active]:shadow", className),
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
  bind_props($$props, { class: className, value });
  pop();
}
const Root$1 = Tabs;
const openedPositionsCount = writable(0);
function Chart($$payload, $$props) {
  push();
  var $$store_subs;
  store_get($$store_subs ??= {}, "$page", page).data?.result?.list.length ? [
    ...store_get($$store_subs ??= {}, "$page", page).data.result.list,
    store_get($$store_subs ??= {}, "$page", page).data.result.latest
  ] : [
    store_get($$store_subs ??= {}, "$page", page).data?.result?.latest
  ];
  $$payload.out += `<div class="w-full h-80"></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function ChartTab($$payload) {
  $$payload.out += `<div class="pb-4"><div class="container grid gap-1"><h1 class="text-2xl tracking-tight font-semibold">BTC <span class="text-lg text-ds-gray-900">/ USDT</span></h1> <div class="text-ds-gray-900 font-medium">Bitcoin</div></div></div> <!--[-->`;
  Chart($$payload);
  $$payload.out += `<!--]-->`;
}
function Note($$payload, $$props) {
  push();
  const { children, class: className, ...rest } = $$props;
  $$payload.out += `<div${spread_attributes({
    class: cn("rounded-md border border-ds-gray-400 bg-transparent text-ds-gray-900 text-sm min-h-9 py-1.5 px-2 flex grow gap-3 leading-normal break-words items-center", className),
    ...rest
  })}><div class="flex gap-2 items-center"><span><!--[-->`;
  Info($$payload, { size: 16 });
  $$payload.out += `<!--]--></span> <span><!--[-->`;
  children($$payload);
  $$payload.out += `<!--]--></span></div></div>`;
  pop();
}
function TradeTab($$payload, $$props) {
  push();
  var $$store_subs;
  getContext(TON_CONNECT_UI_CONTEXT);
  const previousPrice = writable(0);
  const isPriceGoingUp = derived([previousPrice, latestPrices], ([$previousPrice, $latestPrices], set) => {
    if ($previousPrice > $latestPrices.BTCUSDT) {
      set(false);
    } else if ($previousPrice < $latestPrices.BTCUSDT) {
      set(true);
    }
    previousPrice.set($latestPrices.BTCUSDT);
  });
  useBroker(writable(PUBLIC_BROKER_ADDRESS));
  let initiation = initiationTime(3);
  let minInvestment = "1.00";
  let maxInvestment = "0.00";
  let isInvestmentValid = true;
  function initiationTime(numberOfMinutes) {
    return formatTime(new Date(Date.now() + 1e3 * 60 * numberOfMinutes));
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="container"><h1 class="text-ds-gray-900 font-medium">Mark Price</h1> <span${attr("class", cn("text-2xl tracking-tight font-semibold", {
      "text-ds-green-900": store_get($$store_subs ??= {}, "$isPriceGoingUp", isPriceGoingUp),
      "text-ds-red-900": !store_get($$store_subs ??= {}, "$isPriceGoingUp", isPriceGoingUp)
    }))}>${escape_html(store_get($$store_subs ??= {}, "$latestPrices", latestPrices).BTCUSDT.toFixed(2))}</span></div> <div class="w-full p-4 gap-2"><form class="grid gap-4"><div class="grid grid-cols-2 gap-4"><div class="grid gap-2"><!--[-->`;
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
    $$payload2.out += `<!--]--></div></div></div> <div class="grid gap-2"><!--[-->`;
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
      placeholder: `1.00 — ${stringify(maxInvestment)}`,
      min: minInvestment,
      max: maxInvestment,
      step: 0.01,
      oninput: (e) => {
        const value = Number(e.currentTarget.value);
        if (!value) {
          isInvestmentValid = true;
          return;
        }
        if (value < Number(minInvestment) || value > Number(maxInvestment)) {
          isInvestmentValid = false;
        } else {
          isInvestmentValid = true;
        }
      },
      required: true
    });
    $$payload2.out += `<!--]--> <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span></div> <!--[-->`;
    if (!isInvestmentValid) {
      $$payload2.out += `<p class="text-sm text-ds-red-900">The investment must be ${escape_html(minInvestment)} to ${escape_html(maxInvestment)} TON.</p>`;
      $$payload2.out += "<!--]-->";
    } else {
      $$payload2.out += "<!--]!-->";
    }
    $$payload2.out += `</div> <div class="grid grid-cols-2 relative gap-4"><!--[-->`;
    Button($$payload2, {
      class: "bg-ds-green-800 flex gap-2 text-white hover:bg-ds-green-700",
      onclick: () => {
        store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("medium");
      },
      type: "submit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Trending_up($$payload3, { size: "16" });
        $$payload3.out += `<!--]--> Call`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--> <!--[-->`;
    Button($$payload2, {
      class: "flex gap-2",
      variant: "destructive",
      onclick: () => {
        store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("medium");
      },
      type: "submit",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Trending_down($$payload3, { size: "16" });
        $$payload3.out += `<!--]--> Put`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></div> <!--[-->`;
    Note($$payload2, {
      class: "border-ds-amber-400 text-ds-amber-900 selection:bg-amber-500 selection:text-white",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `An additional 2 TON will be reserved for fees, with any excess refunded to you.`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!--]--></form></div>`;
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
function cubic_out(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function slide(node, { delay = 0, duration = 400, easing = cubic_out, axis = "y" } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const primary_property = axis === "y" ? "height" : "width";
  const primary_property_value = parseFloat(style[primary_property]);
  const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
  const capitalized_secondary_properties = secondary_properties.map(
    (e) => (
      /** @type {'Left' | 'Right' | 'Top' | 'Bottom'} */
      `${e[0].toUpperCase()}${e.slice(1)}`
    )
  );
  const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
  const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
  const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
  const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
  const border_width_start_value = parseFloat(
    style[`border${capitalized_secondary_properties[0]}Width`]
  );
  const border_width_end_value = parseFloat(
    style[`border${capitalized_secondary_properties[1]}Width`]
  );
  return {
    delay,
    duration,
    easing,
    css: (t) => `overflow: hidden;opacity: ${Math.min(t * 20, 1) * opacity};${primary_property}: ${t * primary_property_value}px;padding-${secondary_properties[0]}: ${t * padding_start_value}px;padding-${secondary_properties[1]}: ${t * padding_end_value}px;margin-${secondary_properties[0]}: ${t * margin_start_value}px;margin-${secondary_properties[1]}: ${t * margin_end_value}px;border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
  };
}
function Accordion_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "transition", "transitionConfig"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let transition = value_or_fallback($$props["transition"], () => slide);
  let transitionConfig = value_or_fallback($$props["transitionConfig"], () => ({ duration: 200 }));
  $$payload.out += `<!--[-->`;
  Accordion_content$1($$payload, spread_props([
    {
      class: cn("overflow-hidden text-sm pb-4 pt-0", className),
      transition,
      transitionConfig
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
  bind_props($$props, {
    class: className,
    transition,
    transitionConfig
  });
  pop();
}
function Accordion_item($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "value"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let value = $$props["value"];
  $$payload.out += `<!--[-->`;
  Accordion_item$1($$payload, spread_props([
    { value, class: cn("border-b", className) },
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
  bind_props($$props, { class: className, value });
  pop();
}
function Accordion_trigger($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "level"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let level = value_or_fallback($$props["level"], () => 3);
  $$payload.out += `<!--[-->`;
  Accordion_header($$payload, {
    level,
    class: "flex",
    children: ($$payload2, $$slotProps) => {
      $$payload2.out += `<!--[-->`;
      Accordion_trigger$1($$payload2, spread_props([
        {
          class: cn("flex flex-1 items-center justify-between py-4 text-sm overflow-hidden bg-ds-background-100 font-medium transition-all hover:bg-ds-gray-200 [&[data-state=open]>svg]:rotate-180", className)
        },
        $$restProps,
        {
          children: ($$payload3, $$slotProps2) => {
            $$payload3.out += `<!--[-->`;
            slot($$payload3, default_slot($$props), {}, null);
            $$payload3.out += `<!--]--> <!--[-->`;
            Chevron_down($$payload3, {
              size: 16,
              class: "shrink-0 text-ds-gray-900 transition-transform duration-200"
            });
            $$payload3.out += `<!--]-->`;
          },
          $$slots: { default: true }
        }
      ]));
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!--]-->`;
  bind_props($$props, { class: className, level });
  pop();
}
const Root = Accordion;
function Badge($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "href", "variant"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let href = value_or_fallback($$props["href"], () => void 0);
  let variant = value_or_fallback($$props["variant"], () => "default");
  const $$tag = href ? "a" : "span";
  if ($$tag) element(
    $$payload,
    $$tag,
    () => {
      $$payload.out += `${spread_attributes({
        href,
        class: cn(badgeVariants({ variant, className })),
        ...$$restProps
      })}`;
    },
    () => {
      $$payload.out += `<!--[-->`;
      slot($$payload, default_slot($$props), {}, null);
      $$payload.out += `<!--]-->`;
    }
  );
  $$payload.out += `<!---->`;
  bind_props($$props, { class: className, href, variant });
  pop();
}
const badgeVariants = tv({
  base: "inline-flex select-none items-center rounded-full border capitalize px-2.5 h-6 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground shadow",
      secondary: "border-transparent bg-secondary text-secondary-foreground ",
      destructive: "border-transparent bg-destructive text-destructive-foreground shadow",
      outline: "text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
function PositionTab($$payload, $$props) {
  push();
  var $$store_subs;
  const tonConnect = getContext(TON_CONNECT_UI_CONTEXT);
  const activeTab = getContext("activeTab");
  const options = createQuery(derived(isConnected, ($isConnected) => ({
    queryKey: ["positions"],
    queryFn: async () => {
      const res = await fetch(`${PUBLIC_API_URL}/api/${store_get($$store_subs ??= {}, "$tonConnect", tonConnect).connection.wallet?.account.address}/${PUBLIC_BROKER_ADDRESS}/options`);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
    refetchInterval: 1e3 * 10,
    enabled: $isConnected
  })));
  $$payload.out += `<div class="pb-6 container"><!--[-->`;
  if (store_get($$store_subs ??= {}, "$options", options).data && !store_get($$store_subs ??= {}, "$options", options).isError && store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
    $$payload.out += `<!--[-->`;
    Root($$payload, {
      class: "grid gap-3",
      multiple: true,
      children: ($$payload2, $$slotProps) => {
        const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$options", options).data.sort((a, b) => b.optionId - a.optionId));
        $$payload2.out += `<!--[-->`;
        for (let $$index = 0; $$index < each_array.length; $$index++) {
          const option = each_array[$$index];
          $$payload2.out += "<!--[-->";
          $$payload2.out += `<!--[-->`;
          Accordion_item($$payload2, {
            value: option.optionId,
            class: "grid gap-2 overflow-hidden border bg-ds-background-100 break-all rounded-md grid-cols-1",
            children: ($$payload3, $$slotProps2) => {
              $$payload3.out += `<!--[-->`;
              Accordion_trigger($$payload3, {
                class: "p-3 gap-2",
                children: ($$payload4, $$slotProps3) => {
                  $$payload4.out += `<div class="flex flex-1 gap-3 items-center"><div class="w-14 flex justify-start"><!--[-->`;
                  if (option.agreement.optionType) {
                    $$payload4.out += `<span class="text-ds-green-700 flex-row-reverse inline-flex font-medium items-center gap-1">Call <!--[-->`;
                    Trending_up($$payload4, { size: 20 });
                    $$payload4.out += `<!--]--></span>`;
                    $$payload4.out += "<!--]-->";
                  } else {
                    $$payload4.out += `<span class="text-ds-red-700 flex-row-reverse inline-flex font-medium items-center gap-1">Put <!--[-->`;
                    Trending_down($$payload4, { size: 20 });
                    $$payload4.out += `<!--]--></span>`;
                    $$payload4.out += "<!--]!-->";
                  }
                  $$payload4.out += `</div> <div class="flex items-baseline"><div class="text-ds-gray-900 text-sm">Option ID</div> <div class="text-ds-gray-1000 text-sm font-medium">#${escape_html(option.optionId)}</div></div></div> <!--[-->`;
                  Badge($$payload4, {
                    class: cn({
                      "text-ds-teal-900 bg-ds-teal-200": option.status === "deployed",
                      "text-ds-green-900 bg-ds-green-200": option.status === "initiated",
                      "text-ds-amber-900 bg-ds-amber-200": option.status === "expired",
                      "text-ds-blue-900 bg-ds-blue-200": option.status === "settled"
                    }),
                    children: ($$payload5, $$slotProps4) => {
                      $$payload5.out += `${escape_html(option.status)}`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload4.out += `<!--]-->`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!--]--> <!--[-->`;
              Accordion_content($$payload3, {
                class: "px-3 grid gap-4 grid-cols-2",
                children: ($$payload4, $$slotProps3) => {
                  $$payload4.out += `<div class="grid gap-1"><span class="text-ds-gray-900">Initiation Time</span> <span class="text-ds-gray-1000 font-medium">${escape_html(new Date(Number(option?.agreement?.initiation) * 1e3).toLocaleString())}</span></div> <div class="grid gap-1"><span class="text-ds-gray-900">Expiration Time</span> <span class="text-ds-gray-1000 font-medium">${escape_html(new Date(Number(option?.agreement?.expiration) * 1e3).toLocaleString())}</span></div> <div class="grid gap-1"><span class="text-ds-gray-900">Investment Amount</span> <span class="text-ds-gray-1000 font-medium">${escape_html(Number(fromNano(option?.agreement?.investment || 0n)).toFixed(2))} TON</span></div> <div class="grid gap-1"><span class="text-ds-gray-900">Payout Amount</span> <span class="text-ds-gray-1000 font-medium">${escape_html(Number(fromNano(option?.agreement?.payout || 0n)).toFixed(2))} TON</span></div> <div class="grid gap-1 grid-cols-1"><span class="text-ds-gray-900">Option</span> <a class="text-ds-blue-700 font-hubot-sans font-medium"${attr("href", `https://testnet.tonviewer.com/${stringify(option.address)}`)} target="_blank">${escape_html(shortenAddress(option.address))}</a></div> <div class="grid gap-1"><span class="text-ds-gray-900">Strike Price</span> <span class="text-ds-gray-1000 font-medium">${escape_html(option?.strikePrice ? Number(option?.strikePrice) / 100 : "N/A")}</span></div> <div class="grid gap-1"><span class="text-ds-gray-900">Holder</span> <a class="text-ds-blue-700 font-hubot-sans font-medium"${attr("href", `https://testnet.tonviewer.com/${stringify(option?.agreement?.holder)}`)} target="_blank">${escape_html(shortenAddress(option?.agreement?.holder))}</a></div> <div class="grid gap-1"><span class="text-ds-gray-900">Writer</span> <a class="text-ds-blue-700 font-hubot-sans font-medium"${attr("href", `https://testnet.tonviewer.com/${stringify(option?.agreement?.writer)}`)} target="_blank">${escape_html(shortenAddress(option?.agreement?.writer))}</a></div>`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!--]-->`;
            },
            $$slots: { default: true }
          });
          $$payload2.out += `<!--]-->`;
          $$payload2.out += "<!--]-->";
        }
        $$payload2.out += "<!--]-->";
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<div class="flex gap-6 flex-col justify-center items-center"><div class="p-3 border text-ds-gray-900 rounded-md"><!--[-->`;
    Microscope($$payload, { size: 32 });
    $$payload.out += `<!--]--></div> <div class="flex flex-col gap-1 items-center"><p class="font-medium">No Positions Opened Yet</p> <p class="text-ds-gray-900 max-w-[65%] text-center supports-[text-wrap:balance]:text-balance text-sm">It looks like you haven't opened any positions yet. Start exploring the market and open
          your first position.</p></div> <!--[-->`;
    Button($$payload, {
      variant: "secondary",
      onclick: () => {
        activeTab.set("trade");
        store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).impactOccurred("light");
      },
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `Trade Options`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!--]--></div>`;
    $$payload.out += "<!--]!-->";
  }
  $$payload.out += `</div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let activeTab = writable("chart");
  setContext("activeTab", activeTab);
  $$payload.out += `<!--[-->`;
  Root$1($$payload, {
    class: "pt-4",
    value: store_get($$store_subs ??= {}, "$activeTab", activeTab),
    onValueChange: (tab) => {
      if (tab) {
        activeTab.set(tab);
      }
      store_get($$store_subs ??= {}, "$hapticFeedback", hapticFeedback).selectionChanged();
    },
    children: ($$payload2, $$slotProps) => {
      $$payload2.out += `<div class="container"><!--[-->`;
      Tabs_list($$payload2, {
        class: "w-full",
        children: ($$payload3, $$slotProps2) => {
          $$payload3.out += `<!--[-->`;
          Tabs_trigger($$payload3, {
            class: "flex-1",
            value: "chart",
            children: ($$payload4, $$slotProps3) => {
              $$payload4.out += `Chart`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--> <!--[-->`;
          Tabs_trigger($$payload3, {
            class: "flex-1",
            value: "trade",
            children: ($$payload4, $$slotProps3) => {
              $$payload4.out += `Trade`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]--> <!--[-->`;
          Tabs_trigger($$payload3, {
            class: "flex-1",
            value: "positions",
            children: ($$payload4, $$slotProps3) => {
              $$payload4.out += `Positions (${escape_html(store_get($$store_subs ??= {}, "$openedPositionsCount", openedPositionsCount))})`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]--></div> <!--[-->`;
      Tabs_content($$payload2, {
        class: "pt-8 mt-0",
        value: "chart",
        children: ($$payload3, $$slotProps2) => {
          $$payload3.out += `<!--[-->`;
          ChartTab($$payload3);
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]--> <!--[-->`;
      Tabs_content($$payload2, {
        class: "pt-8 mt-0",
        value: "trade",
        children: ($$payload3, $$slotProps2) => {
          $$payload3.out += `<!--[-->`;
          TradeTab($$payload3);
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]--> <!--[-->`;
      Tabs_content($$payload2, {
        class: "pt-8 mt-0",
        value: "positions",
        children: ($$payload3, $$slotProps2) => {
          $$payload3.out += `<!--[-->`;
          PositionTab($$payload3);
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-URJGh8WX.js.map
