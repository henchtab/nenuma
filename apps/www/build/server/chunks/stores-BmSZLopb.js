import { q as getContext } from './index3-C3tkxEZ9.js';
import './client-DxbLJQ2o.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "bc667c18-f9a1-4f3c-a9bd-3133dc728629", e._sentryDebugIdIdentifier = "sentry-dbid-bc667c18-f9a1-4f3c-a9bd-3133dc728629");
  } catch (e2) {
  }
}();
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};

export { page as p };
//# sourceMappingURL=stores-BmSZLopb.js.map
