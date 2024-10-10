import { init, sentryHandle, handleErrorWithSentry } from '@sentry/sveltekit';
import { e as error } from './index-DFCTwyZH.js';
import './_sentry-release-injection-file-DnBzmPpn.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "0a5056c8-b912-4894-a322-139e6d231334", e._sentryDebugIdIdentifier = "sentry-dbid-0a5056c8-b912-4894-a322-139e6d231334");
  } catch (e2) {
  }
}();
function sequence(...handlers) {
  const length = handlers.length;
  if (!length) return ({ event, resolve }) => resolve(event);
  return ({ event, resolve }) => {
    return apply_handle(0, event, {});
    function apply_handle(i, event2, parent_options) {
      const handle2 = handlers[i];
      return handle2({
        event: event2,
        resolve: (event3, options) => {
          const transformPageChunk = async ({ html, done }) => {
            if (options?.transformPageChunk) {
              html = await options.transformPageChunk({ html, done }) ?? "";
            }
            if (parent_options?.transformPageChunk) {
              html = await parent_options.transformPageChunk({ html, done }) ?? "";
            }
            return html;
          };
          const filterSerializedResponseHeaders = parent_options?.filterSerializedResponseHeaders ?? options?.filterSerializedResponseHeaders;
          const preload = parent_options?.preload ?? options?.preload;
          return i < length - 1 ? apply_handle(i + 1, event3, {
            transformPageChunk,
            filterSerializedResponseHeaders,
            preload
          }) : resolve(event3, { transformPageChunk, filterSerializedResponseHeaders, preload });
        }
      });
    }
  };
}
var _global = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
_global["__sentry_sveltekit_output_dir"] = "build";
init({
  dsn: "https://55a4e626777e0b3cc8a1a49313c233e0@o4504770823061504.ingest.us.sentry.io/4507562211868672",
  enabled: true,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1
});
const myHandle = async ({ event, resolve }) => {
  const routeId = event.route.id;
  if (routeId === null) {
    throw error(404, "The route does not exist");
  }
  return resolve(event);
};
const handle = sequence(sentryHandle(), myHandle);
const myErrorHandler = ({ error: error2, event }) => {
  console.error("An error occurred on the server side:", error2, event);
};
const handleError = handleErrorWithSentry(myErrorHandler);

export { handle, handleError };
//# sourceMappingURL=hooks.server-axsAq4Kc.js.map
