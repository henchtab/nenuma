import { s as setContext, d as store_get, u as unsubscribe_stores, b as pop, e as rest_props, p as push, v as value_or_fallback, f as ensure_array_like, g as attr, h as spread_attributes, i as slot, j as bind_props, k as add_styles, m as merge_styles, l as spread_props, n as escape_html, o as sanitize_props } from './index3-C3tkxEZ9.js';
import 'js-cookie';
import { T as TON_CONNECT_UI_CONTEXT } from './constants-YcxnLy9M.js';
import './_sentry-release-injection-file-DnBzmPpn.js';
import { o as onDestroy, t as tonConnect } from './ton-connect-Dy4dENFp.js';
import { m as mediaQuery } from './utils-Cu53aTbv.js';
import '@tonconnect/ui';
import { I as Icon$1 } from './Icon-DC-Mh-BG.js';
import { d as default_slot } from './misc-DisFbBK1.js';
import { c as cn, t as toastState, u as useEffect } from './Toaster.svelte_svelte_type_style_lang-BotT0yJS.js';
import { B as BROWSER } from './prod-ssr-BGB73Y8Z.js';
import './client-DxbLJQ2o.js';
import 'posthog-js';
import { S as Subscribable, h as hashQueryKeyByOptions, Q as Query, n as notifyManager, m as matchQuery, R as Removable, c as createRetryer, a as matchMutation, b as noop, e as ensureQueryFn, d as addToStart, f as addToEnd, g as focusManager, o as onlineManager, r as resolveStaleTime, i as functionalUpdate, j as hashKey, p as partialMatchKey, s as skipToken, k as setQueryClientContext } from './context-EGUegBOV.js';
import './utils2-CiK4tJ06.js';
import '@ton/ton';
import './index2-d8GdKNTl.js';
import 'clsx';
import 'tailwind-merge';
import './tma-DWgLwTMy.js';
import './index-DmRbVFTk.js';

// src/queryCache.ts
var QueryCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        cache: this,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.#queries.get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        this.#queries.delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  getAll() {
    return [...this.#queries.values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
};

// src/mutation.ts
var Mutation = class extends Removable {
  #observers;
  #mutationCache;
  #retryer;
  constructor(config) {
    super();
    this.mutationId = config.mutationId;
    this.#mutationCache = config.mutationCache;
    this.#observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
      this.clearGcTimeout();
      this.#mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    this.#observers = this.#observers.filter((x) => x !== observer);
    this.scheduleGc();
    this.#mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!this.#observers.length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        this.#mutationCache.remove(this);
      }
    }
  }
  continue() {
    return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    this.#retryer = createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables);
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue: () => {
        this.#dispatch({ type: "continue" });
      },
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => this.#mutationCache.canRun(this)
    });
    const restored = this.state.status === "pending";
    const isPaused = !this.#retryer.canStart();
    try {
      if (!restored) {
        this.#dispatch({ type: "pending", variables, isPaused });
        await this.#mutationCache.config.onMutate?.(
          variables,
          this
        );
        const context = await this.options.onMutate?.(variables);
        if (context !== this.state.context) {
          this.#dispatch({
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await this.#retryer.start();
      await this.#mutationCache.config.onSuccess?.(
        data,
        variables,
        this.state.context,
        this
      );
      await this.options.onSuccess?.(data, variables, this.state.context);
      await this.#mutationCache.config.onSettled?.(
        data,
        null,
        this.state.variables,
        this.state.context,
        this
      );
      await this.options.onSettled?.(data, null, variables, this.state.context);
      this.#dispatch({ type: "success", data });
      return data;
    } catch (error) {
      try {
        await this.#mutationCache.config.onError?.(
          error,
          variables,
          this.state.context,
          this
        );
        await this.options.onError?.(
          error,
          variables,
          this.state.context
        );
        await this.#mutationCache.config.onSettled?.(
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this
        );
        await this.options.onSettled?.(
          void 0,
          error,
          variables,
          this.state.context
        );
        throw error;
      } finally {
        this.#dispatch({ type: "error", error });
      }
    } finally {
      this.#mutationCache.runNext(this);
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "pending":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: action.isPaused,
            status: "pending",
            variables: action.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.#observers.forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      this.#mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
};
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}

// src/mutationCache.ts
var MutationCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = /* @__PURE__ */ new Map();
    this.#mutationId = Date.now();
  }
  #mutations;
  #mutationId;
  build(client, options, state) {
    const mutation = new Mutation({
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    const scope = scopeFor(mutation);
    const mutations = this.#mutations.get(scope) ?? [];
    mutations.push(mutation);
    this.#mutations.set(scope, mutations);
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    const scope = scopeFor(mutation);
    if (this.#mutations.has(scope)) {
      const mutations = this.#mutations.get(scope)?.filter((x) => x !== mutation);
      if (mutations) {
        if (mutations.length === 0) {
          this.#mutations.delete(scope);
        } else {
          this.#mutations.set(scope, mutations);
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const firstPendingMutation = this.#mutations.get(scopeFor(mutation))?.find((m) => m.state.status === "pending");
    return !firstPendingMutation || firstPendingMutation === mutation;
  }
  runNext(mutation) {
    const foundMutation = this.#mutations.get(scopeFor(mutation))?.find((m) => m !== mutation && m.state.isPaused);
    return foundMutation?.continue() ?? Promise.resolve();
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((mutation) => {
        this.remove(mutation);
      });
    });
  }
  getAll() {
    return [...this.#mutations.values()].flat();
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
};
function scopeFor(mutation) {
  return mutation.options.scope?.id ?? String(mutation.mutationId);
}

// src/infiniteQueryBehavior.ts
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const fetchFn = async () => {
        const options = context.options;
        const direction = context.fetchOptions?.meta?.fetchMore?.direction;
        const oldPages = context.state.data?.pages || [];
        const oldPageParams = context.state.data?.pageParams || [];
        const empty = { pages: [], pageParams: [] };
        let cancelled = false;
        const addSignalProperty = (object) => {
          Object.defineProperty(object, "signal", {
            enumerable: true,
            get: () => {
              if (context.signal.aborted) {
                cancelled = true;
              } else {
                context.signal.addEventListener("abort", () => {
                  cancelled = true;
                });
              }
              return context.signal;
            }
          });
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject();
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const queryFnContext = {
            queryKey: context.queryKey,
            pageParam: param,
            direction: previous ? "backward" : "forward",
            meta: context.options.meta
          };
          addSignalProperty(queryFnContext);
          const page = await queryFn(
            queryFnContext
          );
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        let result;
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          result = await fetchPage(
            empty,
            oldPageParams[0] ?? options.initialPageParam
          );
          const remainingPages = pages ?? oldPages.length;
          for (let i = 1; i < remainingPages; i++) {
            const param = getNextPageParam(options, result);
            result = await fetchPage(result, param);
          }
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  );
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return options.getPreviousPageParam?.(
    pages[0],
    pages,
    pageParams[0],
    pageParams
  );
}

// src/queryClient.ts
var QueryClient = class {
  #queryCache;
  #mutationCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new QueryCache();
    this.#mutationCache = config.mutationCache || new MutationCache();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
    this.#mountCount = 0;
  }
  mount() {
    this.#mountCount++;
    if (this.#mountCount !== 1)
      return;
    this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        this.#queryCache.onFocus();
      }
    });
    this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        this.#queryCache.onOnline();
      }
    });
  }
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0)
      return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  isFetching(filters) {
    return this.#queryCache.findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return this.#mutationCache.findAll({ ...filters, status: "pending" }).length;
  }
  getQueryData(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options.queryHash)?.state.data;
  }
  ensureQueryData(options) {
    const cachedData = this.getQueryData(options.queryKey);
    if (cachedData === void 0)
      return this.fetchQuery(options);
    else {
      const defaultedOptions = this.defaultQueryOptions(options);
      const query = this.#queryCache.build(this, defaultedOptions);
      if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
        void this.prefetchQuery(defaultedOptions);
      }
      return Promise.resolve(cachedData);
    }
  }
  getQueriesData(filters) {
    return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = this.#queryCache.get(
      defaultedOptions.queryHash
    );
    const prevData = query?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return this.#queryCache.build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => this.#queryCache.findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options.queryHash)?.state;
  }
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = this.#queryCache;
    const refetchFilters = {
      type: "active",
      ...filters
    };
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(refetchFilters, options);
    });
  }
  cancelQueries(filters = {}, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(filters = {}, options = {}) {
    return notifyManager.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters.refetchType === "none") {
        return Promise.resolve();
      }
      const refetchFilters = {
        ...filters,
        type: filters.refetchType ?? filters.type ?? "active"
      };
      return this.refetchQueries(refetchFilters, options);
    });
  }
  refetchQueries(filters = {}, options) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options?.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return this.#mutationCache.resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getMutationCache() {
    return this.#mutationCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  setDefaultOptions(options) {
    this.#defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    this.#queryDefaults.set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    let result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        result = { ...result, ...queryDefault.defaultOptions };
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    this.#mutationDefaults.set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...this.#mutationDefaults.values()];
    let result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        result = { ...result, ...queryDefault.defaultOptions };
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.enabled !== true && defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...this.#defaultOptions.mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "2f7be862-fa35-422c-8eb3-ca814d649d92", e._sentryDebugIdIdentifier = "sentry-dbid-2f7be862-fa35-422c-8eb3-ca814d649d92");
  } catch (e2) {
  }
}();
const browser = BROWSER;
function Triangle_alert($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
      }
    ],
    ["path", { "d": "M12 9v4" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  $$payload.out += `<!--[-->`;
  Icon$1($$payload, spread_props([
    { name: "triangle-alert" },
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
function Icon($$payload, $$props) {
  let type = value_or_fallback($$props["type"], () => "success");
  $$payload.out += `<!--[-->`;
  if (type === "success") {
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<!--[-->`;
    if (type === "error") {
      $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += `<!--[-->`;
      if (type === "info") {
        $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>`;
        $$payload.out += "<!--]-->";
      } else {
        $$payload.out += `<!--[-->`;
        if (type === "warning") {
          $$payload.out += `<svg viewBox="0 0 64 64" fill="currentColor" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z"></path><path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z"></path></svg>`;
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
  bind_props($$props, { type });
}
function Loader($$payload, $$props) {
  push();
  let visible = $$props["visible"];
  const bars = Array(12).fill(0);
  const each_array = ensure_array_like(bars);
  $$payload.out += `<div class="sonner-loading-wrapper"${attr("data-visible", visible)}><div class="sonner-spinner"><!--[-->`;
  for (let i = 0; i < each_array.length; i++) {
    each_array[i];
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="sonner-loading-bar"></div>`;
    $$payload.out += "<!--]-->";
  }
  $$payload.out += "<!--]-->";
  $$payload.out += `</div></div>`;
  bind_props($$props, { visible });
  pop();
}
function Toast($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  var $$store_subs;
  let isFront, isVisible, toastType, toastClass, toastDescriptionClass, heightIndex, coords, toastsHeightBefore, disabled, isPromiseLoadingOrInfiniteDuration;
  const TOAST_LIFETIME = 4e3;
  const GAP = 14;
  const TIME_BEFORE_UNMOUNT = 200;
  const defaultClasses = {
    toast: "",
    title: "",
    description: "",
    loader: "",
    closeButton: "",
    cancelButton: "",
    actionButton: "",
    action: "",
    warning: "",
    error: "",
    success: "",
    default: "",
    info: "",
    loading: ""
  };
  const {
    toasts,
    heights,
    removeHeight,
    setHeight,
    remove
  } = toastState;
  let toast = $$props["toast"];
  let index = $$props["index"];
  let expanded = $$props["expanded"];
  let invert = $$props["invert"];
  let position = $$props["position"];
  let visibleToasts = $$props["visibleToasts"];
  let expandByDefault = $$props["expandByDefault"];
  let closeButton = $$props["closeButton"];
  let interacting = $$props["interacting"];
  let cancelButtonStyle = value_or_fallback($$props["cancelButtonStyle"], () => "");
  let actionButtonStyle = value_or_fallback($$props["actionButtonStyle"], () => "");
  let duration = value_or_fallback($$props["duration"], () => 4e3);
  let descriptionClass = value_or_fallback($$props["descriptionClass"], () => "");
  let classes = value_or_fallback($$props["classes"], () => ({}));
  let unstyled = value_or_fallback($$props["unstyled"], () => false);
  let mounted = false;
  let removed = false;
  let swiping = false;
  let swipeOut = false;
  let offsetBeforeRemove = 0;
  let initialHeight = 0;
  let offset = 0;
  let closeTimerStartTimeRef = 0;
  let lastCloseTimerStartTimeRef = 0;
  async function updateHeights() {
    {
      return;
    }
  }
  function deleteToast() {
    removed = true;
    offsetBeforeRemove = offset;
    removeHeight(toast.id);
    setTimeout(
      () => {
        remove(toast.id);
      },
      TIME_BEFORE_UNMOUNT
    );
  }
  let timeoutId;
  let remainingTime = toast.duration || duration || TOAST_LIFETIME;
  function pauseTimer() {
    if (lastCloseTimerStartTimeRef < closeTimerStartTimeRef) {
      const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef;
      remainingTime = remainingTime - elapsedTime;
    }
    lastCloseTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
  }
  function startTimer() {
    closeTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
    timeoutId = setTimeout(
      () => {
        toast.onAutoClose?.(toast);
        deleteToast();
      },
      remainingTime
    );
  }
  let effect;
  classes = { ...defaultClasses, ...classes };
  isFront = index === 0;
  isVisible = index + 1 <= visibleToasts;
  toast.title;
  toast.description;
  toastType = toast.type;
  toastClass = toast.class || "";
  toastDescriptionClass = toast.descriptionClass || "";
  heightIndex = store_get($$store_subs ??= {}, "$heights", heights).findIndex((height) => height.toastId === toast.id) || 0;
  coords = position.split("-");
  toastsHeightBefore = store_get($$store_subs ??= {}, "$heights", heights).reduce(
    (prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex) return prev;
      return prev + curr.height;
    },
    0
  );
  invert = toast.invert || invert;
  disabled = toastType === "loading";
  offset = Math.round(heightIndex * GAP + toastsHeightBefore);
  updateHeights();
  if (toast.updated) {
    clearTimeout(timeoutId);
    remainingTime = toast.duration || duration || TOAST_LIFETIME;
    startTimer();
  }
  isPromiseLoadingOrInfiniteDuration = toast.promise && toastType === "loading" || toast.duration === Number.POSITIVE_INFINITY;
  effect = useEffect(() => {
    if (!isPromiseLoadingOrInfiniteDuration) {
      if (expanded || interacting) {
        pauseTimer();
      } else {
        startTimer();
      }
    }
    return () => clearTimeout(timeoutId);
  });
  store_get($$store_subs ??= {}, "$effect", effect);
  if (toast.delete) {
    deleteToast();
  }
  $$payload.out += `<li${add_styles(merge_styles(`${$$sanitized_props.style} ${toast.style}`, {
    "--index": index,
    "--toasts-before": index,
    "--z-index": store_get($$store_subs ??= {}, "$toasts", toasts).length - index,
    "--offset": `${removed ? offsetBeforeRemove : offset}px`,
    "--initial-height": `${initialHeight}px`
  }))}${attr("aria-live", toast.important ? "assertive" : "polite")} aria-atomic="true" role="status"${attr("tabindex", 0)}${attr("class", cn($$sanitized_props.class, toastClass, classes?.toast, toast?.classes?.toast, classes?.[toastType], toast?.classes?.[toastType]))} data-sonner-toast=""${attr("data-styled", !(toast.component || toast?.unstyled || unstyled))}${attr("data-mounted", mounted)}${attr("data-promise", Boolean(toast.promise))}${attr("data-removed", removed)}${attr("data-visible", isVisible)}${attr("data-y-position", coords[0])}${attr("data-x-position", coords[1])}${attr("data-index", index)}${attr("data-front", isFront)}${attr("data-swiping", swiping)}${attr("data-type", toastType)}${attr("data-invert", invert)}${attr("data-swipe-out", swipeOut)}${attr("data-expanded", Boolean(expanded || expandByDefault && mounted))}><!--[-->`;
  if (closeButton && !toast.component) {
    $$payload.out += `<button aria-label="Close toast"${attr("data-disabled", disabled)} data-close-button=""${attr("class", cn(classes?.closeButton, toast?.classes?.closeButton))}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += "<!--]!-->";
  }
  $$payload.out += ` <!--[-->`;
  if (toast.component) {
    $$payload.out += `<!--[-->`;
    toast.component?.($$payload, spread_props([toast.componentProps]));
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<!--[-->`;
    if (toastType !== "default" || toast.icon || toast.promise) {
      $$payload.out += `<div data-icon=""><!--[-->`;
      if ((toast.promise || toastType === "loading") && !toast.icon) {
        $$payload.out += `<!--[-->`;
        slot($$payload, $$props.$$slots?.["loading-icon"], {}, null);
        $$payload.out += `<!--]-->`;
        $$payload.out += "<!--]-->";
      } else {
        $$payload.out += "<!--]!-->";
      }
      $$payload.out += ` <!--[-->`;
      if (toast.icon) {
        $$payload.out += `<!--[-->`;
        toast.icon?.($$payload, {});
        $$payload.out += `<!--]-->`;
        $$payload.out += "<!--]-->";
      } else {
        $$payload.out += `<!--[-->`;
        if (toastType === "success") {
          $$payload.out += `<!--[-->`;
          slot($$payload, $$props.$$slots?.["success-icon"], {}, null);
          $$payload.out += `<!--]-->`;
          $$payload.out += "<!--]-->";
        } else {
          $$payload.out += `<!--[-->`;
          if (toastType === "error") {
            $$payload.out += `<!--[-->`;
            slot($$payload, $$props.$$slots?.["error-icon"], {}, null);
            $$payload.out += `<!--]-->`;
            $$payload.out += "<!--]-->";
          } else {
            $$payload.out += `<!--[-->`;
            if (toastType === "warning") {
              $$payload.out += `<!--[-->`;
              slot($$payload, $$props.$$slots?.["warning-icon"], {}, null);
              $$payload.out += `<!--]-->`;
              $$payload.out += "<!--]-->";
            } else {
              $$payload.out += `<!--[-->`;
              if (toastType === "info") {
                $$payload.out += `<!--[-->`;
                slot($$payload, $$props.$$slots?.["info-icon"], {}, null);
                $$payload.out += `<!--]-->`;
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
      $$payload.out += `</div>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += ` <div data-content=""><!--[-->`;
    if (toast.title) {
      $$payload.out += `<div data-title=""${attr("class", cn(classes?.title, toast?.classes?.title))}><!--[-->`;
      if (typeof toast.title !== "string") {
        $$payload.out += `<!--[-->`;
        toast.title?.($$payload, spread_props([toast.componentProps]));
        $$payload.out += `<!--]-->`;
        $$payload.out += "<!--]-->";
      } else {
        $$payload.out += `${escape_html(toast.title)}`;
        $$payload.out += "<!--]!-->";
      }
      $$payload.out += `</div>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += ` <!--[-->`;
    if (toast.description) {
      $$payload.out += `<div data-description=""${attr("class", cn(descriptionClass, toastDescriptionClass, classes?.description, toast.classes?.description))}><!--[-->`;
      if (typeof toast.description !== "string") {
        $$payload.out += `<!--[-->`;
        toast.description?.($$payload, spread_props([toast.componentProps]));
        $$payload.out += `<!--]-->`;
        $$payload.out += "<!--]-->";
      } else {
        $$payload.out += `${escape_html(toast.description)}`;
        $$payload.out += "<!--]!-->";
      }
      $$payload.out += `</div>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += `</div> <!--[-->`;
    if (toast.cancel) {
      $$payload.out += `<button data-button="" data-cancel=""${attr("style", cancelButtonStyle)}${attr("class", cn(classes?.cancelButton, toast?.classes?.cancelButton))}>${escape_html(toast.cancel.label)}</button>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += ` <!--[-->`;
    if (toast.action) {
      $$payload.out += `<button data-button=""${attr("style", actionButtonStyle)}${attr("class", cn(classes?.actionButton, toast?.classes?.actionButton))}>${escape_html(toast.action.label)}</button>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += "<!--]!-->";
  }
  $$payload.out += `</li>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    toast,
    index,
    expanded,
    invert,
    position,
    visibleToasts,
    expandByDefault,
    closeButton,
    interacting,
    cancelButtonStyle,
    actionButtonStyle,
    duration,
    descriptionClass,
    classes,
    unstyled
  });
  pop();
}
function Toaster($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "invert",
    "theme",
    "position",
    "hotkey",
    "richColors",
    "expand",
    "duration",
    "visibleToasts",
    "closeButton",
    "toastOptions",
    "offset",
    "dir"
  ]);
  push();
  var $$store_subs;
  let possiblePositions, hotkeyLabel;
  const VISIBLE_TOASTS_AMOUNT = 3;
  const VIEWPORT_OFFSET = "32px";
  const TOAST_WIDTH = 356;
  const GAP = 14;
  const DARK = "dark";
  const LIGHT = "light";
  function getInitialTheme(t) {
    if (t !== "system") {
      return t;
    }
    if (typeof window !== "undefined") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return DARK;
      }
      return LIGHT;
    }
    return LIGHT;
  }
  function getDocumentDirection() {
    if (typeof window === "undefined") return "ltr";
    if (typeof document === "undefined") return "ltr";
    const dirAttribute = document.documentElement.getAttribute("dir");
    if (dirAttribute === "auto" || !dirAttribute) {
      return window.getComputedStyle(document.documentElement).direction;
    }
    return dirAttribute;
  }
  let invert = value_or_fallback($$props["invert"], () => false);
  let theme = value_or_fallback($$props["theme"], () => "light");
  let position = value_or_fallback($$props["position"], () => "bottom-right");
  let hotkey = value_or_fallback($$props["hotkey"], () => ["altKey", "KeyT"]);
  let richColors = value_or_fallback($$props["richColors"], () => false);
  let expand = value_or_fallback($$props["expand"], () => false);
  let duration = value_or_fallback($$props["duration"], () => 4e3);
  let visibleToasts = value_or_fallback($$props["visibleToasts"], () => VISIBLE_TOASTS_AMOUNT);
  let closeButton = value_or_fallback($$props["closeButton"], () => false);
  let toastOptions = value_or_fallback($$props["toastOptions"], () => ({}));
  let offset = value_or_fallback($$props["offset"], () => null);
  let dir = value_or_fallback($$props["dir"], getDocumentDirection);
  const tmp = toastState, toasts = tmp.toasts, heights = tmp.heights;
  let expanded = false;
  let interacting = false;
  let actualTheme = getInitialTheme(theme);
  onDestroy(() => {
  });
  possiblePositions = Array.from(new Set([
    position,
    ...store_get($$store_subs ??= {}, "$toasts", toasts).filter((toast) => toast.position).map((toast) => toast.position)
  ].filter(Boolean)));
  hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  if (store_get($$store_subs ??= {}, "$toasts", toasts).length <= 1) {
    expanded = false;
  }
  {
    const toastsToDismiss = store_get($$store_subs ??= {}, "$toasts", toasts).filter((toast) => toast.dismiss && !toast.delete);
    if (toastsToDismiss.length > 0) {
      const updatedToasts = store_get($$store_subs ??= {}, "$toasts", toasts).map((toast) => {
        const matchingToast = toastsToDismiss.find((dismissToast) => dismissToast.id === toast.id);
        if (matchingToast) {
          return { ...toast, delete: true };
        }
        return toast;
      });
      toasts.set(updatedToasts);
    }
  }
  {
    if (theme !== "system") {
      actualTheme = theme;
    }
    if (typeof window !== "undefined") {
      if (theme === "system") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          actualTheme = DARK;
        } else {
          actualTheme = LIGHT;
        }
      }
      const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
      const changeHandler = ({ matches }) => {
        actualTheme = matches ? DARK : LIGHT;
      };
      if ("addEventListener" in mediaQueryList) {
        mediaQueryList.addEventListener("change", changeHandler);
      } else {
        mediaQueryList.addListener(changeHandler);
      }
    }
  }
  $$payload.out += `<!--[-->`;
  if (store_get($$store_subs ??= {}, "$toasts", toasts).length > 0) {
    const each_array = ensure_array_like(possiblePositions);
    $$payload.out += `<section${attr("aria-label", `Notifications ${hotkeyLabel}`)}${attr("tabindex", -1)} class="svelte-1fo5d1m"><!--[-->`;
    for (let index = 0; index < each_array.length; index++) {
      const position2 = each_array[index];
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts).filter((toast) => !toast.position && index === 0 || toast.position === position2));
      $$payload.out += `<ol${spread_attributes(
        {
          tabindex: -1,
          class: $$sanitized_props.class,
          "data-sonner-toaster": true,
          "data-theme": actualTheme,
          "data-rich-colors": richColors,
          dir: dir === "auto" ? getDocumentDirection() : dir,
          "data-y-position": position2.split("-")[0],
          "data-x-position": position2.split("-")[1],
          style: $$sanitized_props.style,
          ...$$restProps
        },
        { "svelte-1fo5d1m": true },
        {
          "--front-toast-height": `${store_get($$store_subs ??= {}, "$heights", heights)[0]?.height}px`,
          "--offset": typeof offset === "number" ? `${offset}px` : offset || VIEWPORT_OFFSET,
          "--width": `${TOAST_WIDTH}px`,
          "--gap": `${GAP}px`
        }
      )}><!--[-->`;
      for (let index2 = 0; index2 < each_array_1.length; index2++) {
        const toast = each_array_1[index2];
        $$payload.out += "<!--[-->";
        $$payload.out += `<!--[-->`;
        Toast($$payload, {
          index: index2,
          toast,
          invert,
          visibleToasts,
          closeButton,
          interacting,
          position: position2,
          expandByDefault: expand,
          expanded,
          actionButtonStyle: toastOptions?.actionButtonStyle || "",
          cancelButtonStyle: toastOptions?.cancelButtonStyle || "",
          class: toastOptions?.class || "",
          descriptionClass: toastOptions?.descriptionClass || "",
          classes: toastOptions.classes || {},
          duration: toastOptions?.duration ?? duration,
          unstyled: toastOptions.unstyled || false,
          $$slots: {
            "loading-icon": ($$payload2, $$slotProps) => {
              $$payload2.out += `<!--[-->`;
              slot($$payload2, $$props.$$slots?.["loading-icon"], {}, () => {
                $$payload2.out += `<!--[-->`;
                Loader($$payload2, { visible: toast.type === "loading" });
                $$payload2.out += `<!--]-->`;
              });
              $$payload2.out += `<!--]-->`;
            },
            "success-icon": ($$payload2, $$slotProps) => {
              $$payload2.out += `<!--[-->`;
              slot($$payload2, $$props.$$slots?.["success-icon"], {}, () => {
                $$payload2.out += `<!--[-->`;
                Icon($$payload2, { type: "success" });
                $$payload2.out += `<!--]-->`;
              });
              $$payload2.out += `<!--]-->`;
            },
            "error-icon": ($$payload2, $$slotProps) => {
              $$payload2.out += `<!--[-->`;
              slot($$payload2, $$props.$$slots?.["error-icon"], {}, () => {
                $$payload2.out += `<!--[-->`;
                Icon($$payload2, { type: "error" });
                $$payload2.out += `<!--]-->`;
              });
              $$payload2.out += `<!--]-->`;
            },
            "warning-icon": ($$payload2, $$slotProps) => {
              $$payload2.out += `<!--[-->`;
              slot($$payload2, $$props.$$slots?.["warning-icon"], {}, () => {
                $$payload2.out += `<!--[-->`;
                Icon($$payload2, { type: "warning" });
                $$payload2.out += `<!--]-->`;
              });
              $$payload2.out += `<!--]-->`;
            },
            "info-icon": ($$payload2, $$slotProps) => {
              $$payload2.out += `<!--[-->`;
              slot($$payload2, $$props.$$slots?.["info-icon"], {}, () => {
                $$payload2.out += `<!--[-->`;
                Icon($$payload2, { type: "info" });
                $$payload2.out += `<!--]-->`;
              });
              $$payload2.out += `<!--]-->`;
            }
          }
        });
        $$payload.out += `<!--]-->`;
        $$payload.out += "<!--]-->";
      }
      $$payload.out += "<!--]-->";
      $$payload.out += `</ol>`;
      $$payload.out += "<!--]-->";
    }
    $$payload.out += "<!--]-->";
    $$payload.out += `</section>`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    invert,
    theme,
    position,
    hotkey,
    richColors,
    expand,
    duration,
    visibleToasts,
    closeButton,
    toastOptions,
    offset,
    dir
  });
  pop();
}
function QueryClientProvider($$payload, $$props) {
  push();
  let client = value_or_fallback($$props["client"], () => new QueryClient());
  setQueryClientContext(client);
  onDestroy(() => {
    client.unmount();
  });
  $$payload.out += `<!--[-->`;
  slot($$payload, default_slot($$props), {}, null);
  $$payload.out += `<!--]-->`;
  bind_props($$props, { client });
  pop();
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { children } = $$props;
  const queryClient = new QueryClient({
    defaultOptions: { queries: { enabled: browser } }
  });
  const isDesktop = mediaQuery();
  setContext(TON_CONNECT_UI_CONTEXT, tonConnect);
  $$payload.out += `<!--[-->`;
  QueryClientProvider($$payload, {
    client: queryClient,
    children: ($$payload2, $$slotProps) => {
      $$payload2.out += `<div class="group data-[sticky-app]:absolute data-[sticky-app]:inset-0 data-[sticky-app]:overflow-x-hidden data-[sticky-app]:overflow-y-auto"><div class="group-data-[sticky-app]:h-[calc(100%+1px)]"><div class="relative isolate min-h-screen flex bg-ds-background-200 flex-col"><header class="bg-ds-amber-100 border-b border-ds-amber-400 text-center text-ds-amber-900 p-2 font-medium flex items-center justify-center min-h-10 select-none cursor-default"><div class="max-w-[60%] text-sm flex items-center gap-2"><!--[-->`;
      Triangle_alert($$payload2, { size: 16, strokeWidth: 1.5 });
      $$payload2.out += `<!--]--> Testnet Only</div></header> <!--[-->`;
      children($$payload2);
      $$payload2.out += `<!--]--></div> <div id="portalled-content"></div></div></div>`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!--]--> <!--[-->`;
  Toaster($$payload, {
    position: store_get($$store_subs ??= {}, "$isDesktop", isDesktop) ? "bottom-right" : "top-center",
    richColors: true,
    theme: "dark",
    toastOptions: {
      classes: {
        default: "",
        error: "!bg-ds-red-100 !text-ds-red-900"
      }
    }
  });
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DdDyGsoM.js.map
