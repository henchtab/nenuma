import { e as rest_props, p as push, v as value_or_fallback, f as ensure_array_like, h as spread_attributes, y as element, i as slot, j as bind_props, b as pop, o as sanitize_props } from './index3-C3tkxEZ9.js';
import { d as default_slot } from './misc-DisFbBK1.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "ae614903-07e5-4ed7-8822-43cf97a7a6b2", e._sentryDebugIdIdentifier = "sentry-dbid-ae614903-07e5-4ed7-8822-43cf97a7a6b2");
  } catch (e2) {
  }
}();
/**
 * @license lucide-svelte v0.408.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  push();
  let name = value_or_fallback($$props["name"], () => void 0);
  let color = value_or_fallback($$props["color"], () => "currentColor");
  let size = value_or_fallback($$props["size"], () => 24);
  let strokeWidth = value_or_fallback($$props["strokeWidth"], () => 2);
  let absoluteStrokeWidth = value_or_fallback($$props["absoluteStrokeWidth"], () => false);
  let iconNode = value_or_fallback($$props["iconNode"], () => []);
  const mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && array.indexOf(className) === index;
  }).join(" ");
  const each_array = ensure_array_like(iconNode);
  $$payload.out += `<svg${spread_attributes(
    {
      ...defaultAttributes,
      ...$$restProps,
      width: size,
      height: size,
      stroke: color,
      "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      class: mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class)
    },
    void 0,
    void 0,
    3
  )}><!--[-->`;
  for (let $$index = 0; $$index < each_array.length; $$index++) {
    const $$item = each_array[$$index];
    const [tag, attrs] = $$item;
    $$payload.out += "<!--[-->";
    if (tag) element(
      $$payload,
      tag,
      () => {
        $$payload.out += `${spread_attributes({ ...attrs }, void 0, void 0, 3)}`;
      },
      () => {
      }
    );
    $$payload.out += `<!---->`;
    $$payload.out += "<!--]-->";
  }
  $$payload.out += "<!--]-->";
  $$payload.out += `<!--[-->`;
  slot($$payload, default_slot($$props), {}, null);
  $$payload.out += `<!--]--></svg>`;
  bind_props($$props, {
    name,
    color,
    size,
    strokeWidth,
    absoluteStrokeWidth,
    iconNode
  });
  pop();
}

export { Icon as I };
//# sourceMappingURL=Icon-DC-Mh-BG.js.map
