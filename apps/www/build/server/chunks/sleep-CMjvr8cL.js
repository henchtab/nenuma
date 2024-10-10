!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "188bfce9-9c62-4c3f-84a1-797e9170e971", e._sentryDebugIdIdentifier = "sentry-dbid-188bfce9-9c62-4c3f-84a1-797e9170e971");
  } catch (e2) {
  }
}();
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { sleep as s };
//# sourceMappingURL=sleep-CMjvr8cL.js.map
