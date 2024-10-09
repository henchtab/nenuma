!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "0e391941-bc34-4149-9d9f-c9f9be441344", e._sentryDebugIdIdentifier = "sentry-dbid-0e391941-bc34-4149-9d9f-c9f9be441344");
  } catch (e2) {
  }
}();
const noop = () => {
};
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function subscribe_to_store(store, run, invalidate) {
  if (store == null) {
    run(void 0);
    if (invalidate) invalidate(void 0);
    return noop;
  }
  const unsub = store.subscribe(
    run,
    // @ts-expect-error
    invalidate
  );
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

export { noop as n, run_all as r, subscribe_to_store as s };
//# sourceMappingURL=utils2-CiK4tJ06.js.map
