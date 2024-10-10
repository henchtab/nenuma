import { p as push, f as ensure_array_like, n as escape_html, j as bind_props, b as pop } from './index3-C3tkxEZ9.js';
import '@formkit/auto-animate';
import { B as Button } from './index4-oP-Y0xSz.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "9985290a-aedc-4ce8-9c1e-db0464a6dfd2", e._sentryDebugIdIdentifier = "sentry-dbid-9985290a-aedc-4ce8-9c1e-db0464a6dfd2");
  } catch (e2) {
  }
}();
function Output($$payload, $$props) {
  push();
  let { output = void 0 } = $$props;
  $$payload.out += `<div class="flex flex-col gap-4 mt-6"><h3 class="text-ds-gray-1000 font-medium text-xl">Output</h3> <ul class="border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 whitespace-nowrap overflow-auto py-4"><!--[-->`;
  if (output.length === 0) {
    $$payload.out += `<li class="h-8 text-ds-gray-900 inline-flex items-center pt-4">Logs will appear here...</li>`;
    $$payload.out += "<!--]-->";
  } else {
    const each_array = ensure_array_like(output);
    $$payload.out += `<!--[-->`;
    for (let $$index = 0; $$index < each_array.length; $$index++) {
      const line = each_array[$$index];
      $$payload.out += "<!--[-->";
      $$payload.out += `<li class="flex h-8 gap-2 w-full items-center"><span class="text-ds-green-900 pr-2 border-r">${escape_html(line.date)}:</span> <span class="text-ds-green-900">${escape_html(line.message)}</span></li>`;
      $$payload.out += "<!--]-->";
    }
    $$payload.out += "<!--]-->";
    $$payload.out += "<!--]!-->";
  }
  $$payload.out += `</ul> <!--[-->`;
  Button($$payload, {
    variant: "destructive",
    onclick: () => output = [],
    children: ($$payload2, $$slotProps) => {
      $$payload2.out += `Clear Output`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { output });
  pop();
}

export { Output as O };
//# sourceMappingURL=Output-B9sb5j8q.js.map
