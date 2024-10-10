import { l as spread_props, i as slot, o as sanitize_props } from './index3-C3tkxEZ9.js';
import { I as Icon } from './Icon-DC-Mh-BG.js';
import { d as default_slot } from './misc-DisFbBK1.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "b361278a-f9cd-446b-803d-a4fc5def506a", e._sentryDebugIdIdentifier = "sentry-dbid-b361278a-f9cd-446b-803d-a4fc5def506a");
  } catch (e2) {
  }
}();
function getElemDirection(elem) {
  const style = window.getComputedStyle(elem);
  const direction = style.getPropertyValue("direction");
  return direction;
}
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}
function Chevron_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "chevron-down" },
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
function Trending_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "polyline",
      { "points": "22 17 13.5 8.5 8.5 13.5 2 7" }
    ],
    [
      "polyline",
      { "points": "16 17 22 17 22 11" }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "trending-down" },
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
function Trending_up($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "polyline",
      { "points": "22 7 13.5 15.5 8.5 10.5 2 17" }
    ],
    ["polyline", { "points": "16 7 22 7 22 13" }]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "trending-up" },
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

export { Chevron_down as C, Trending_up as T, Trending_down as a, arraysAreEqual as b, getElemDirection as g };
//# sourceMappingURL=trending-up-YEnm4n4v.js.map
