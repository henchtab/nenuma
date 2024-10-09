import { p as push, n as escape_html, b as pop } from './index3-C3tkxEZ9.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "671f08ee-ede7-4622-9bd9-8cf31704be3c", e._sentryDebugIdIdentifier = "sentry-dbid-671f08ee-ede7-4622-9bd9-8cf31704be3c");
  } catch (e2) {
  }
}();
function Section($$payload, $$props) {
  push();
  let { children, title } = $$props;
  $$payload.out += `<div class="py-6"><div class="container"><h1 class="text-ds-gray-1000 font-medium text-2xl">${escape_html(title)}</h1> <!--[-->`;
  children($$payload);
  $$payload.out += `<!--]--></div></div>`;
  pop();
}

export { Section as S };
//# sourceMappingURL=Section-4oNqorjo.js.map
