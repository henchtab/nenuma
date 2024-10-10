import { e as rest_props, p as push, v as value_or_fallback, h as spread_attributes, j as bind_props, b as pop, l as spread_props, i as slot, d as store_get, u as unsubscribe_stores, o as sanitize_props } from './index3-C3tkxEZ9.js';
import { g as getValidUntil, c as cn } from './utils-D4QS32x_.js';
import { m as makeElement, a as addMeltEventListener, c as createBitAttrs } from './index4-Bx_7Dk7S.js';
import { d as default_slot } from './misc-DisFbBK1.js';
import { TonClient4, TonClient, Address, beginCell, toNano as toNano$1 } from '@ton/ton';
import { CHAIN } from '@tonconnect/ui';
import { toNano, contractAddress, Slice, beginCell as beginCell$1, TupleBuilder, Builder, Dictionary, Cell } from '@ton/core';
import './_sentry-release-injection-file-DHom2vTX.js';
import { r as readable, d as derived } from './index2-d8GdKNTl.js';
import { D as DST_DEPLOY_DEPOSIT, b as DST_DEPLOY_BATCH_DEPOSIT, c as DST_DEPLOY_SESSION_DEPOSIT, d as DST_PUBLISH_CANDLESTICK_DEPOSIT, S as SUBSCRIPTION_BATCHES_STORAGE_KEY, B as BRG_DEPLOY_BROKER_DEPOSIT, e as BRG_DEPLOY_ACCOUNT_DEPOSIT, f as DATA_STREAM_STORAGE_KEY, g as SESSION_STORAGE_KEY, h as SES_SUBSCRIBE_DEPOSIT, i as SIMPLE_SUBSCRIBER_STORAGE_KEY, O as OPTIONS_STORAGE_KEY, L as LATEST_OPTION_STORAGE_KEY } from './constants-BJLYdDiK.js';
import { c as tonConnectUI, s as sender } from './ton-connect-B099bpYZ.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "43c01973-1761-41a6-9d08-763824d505d0", e._sentryDebugIdIdentifier = "sentry-dbid-43c01973-1761-41a6-9d08-763824d505d0");
  } catch (e2) {
  }
}();
function createLabel() {
  const root = makeElement("label", {
    action: (node) => {
      const mouseDown = addMeltEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    elements: {
      root
    }
  };
}
function getLabelData() {
  const NAME = "label";
  const PARTS = ["root"];
  const getAttrs = createBitAttrs(NAME, PARTS);
  return {
    NAME,
    getAttrs
  };
}
function Label$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { root } } = createLabel();
  const { getAttrs } = getLabelData();
  const attrs = getAttrs("root");
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
    $$payload.out += `<label${spread_attributes({ ...builder, ...$$restProps })}><!--[-->`;
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
    $$payload.out += `<!--]--></label>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function saveContractAddress(contract, key) {
  try {
    let address;
    if (typeof contract === "string") {
      address = contract;
    } else {
      address = contract.address.toString({ testOnly: true });
    }
    localStorage.setItem(
      key,
      JSON.stringify({
        address,
        timestamp: Date.now()
      })
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.error("Failed to save stream address: quota exceeded");
    }
  }
}
function loadData(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}
function Input($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "value", "readonly"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let value = value_or_fallback($$props["value"], () => void 0);
  let readonly = value_or_fallback($$props["readonly"], () => void 0);
  $$payload.out += `<input${spread_attributes({
    class: cn("flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ds-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-gray-600 disabled:cursor-not-allowed disabled:opacity-50", className),
    autocapitalize: "none",
    autocomplete: "off",
    autocorrect: "off",
    spellcheck: "false",
    value,
    readonly,
    ...$$restProps
  })}>`;
  bind_props($$props, { class: className, value, readonly });
  pop();
}
function Label($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<!--[-->`;
  Label$1($$payload, spread_props([
    {
      class: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)
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
function me(i9) {
  return (t) => {
    let e = t;
    e.storeUint(4195386677, 32), e.storeUint(i9.queryId, 64);
  };
}
function Ae(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1366331229, 32), e.storeUint(i9.queryId, 64);
  };
}
function De(i9) {
  return (t) => {
    let e = t;
    e.storeUint(2141827764, 32), e.storeUint(i9.queryId, 64);
  };
}
function Ce(i9) {
  return (t) => {
    let e = t;
    e.storeUint(550691255, 32), e.storeUint(i9.queryId, 64);
  };
}
function L(i9) {
  let t = i9.readBigNumber(), e = i9.readBigNumber();
  return { $$type: "Fraction", nominator: t, denominator: e };
}
function we(i9) {
  return (t) => {
    let e = t;
    e.storeAddress(i9.holder), e.storeInt(i9.initiation, 257), e.storeInt(i9.expiration, 257), e.storeBit(i9.optionType);
    let n = new Builder();
    n.storeInt(i9.investment, 257), e.storeRef(n.endCell());
  };
}
function O(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1174791129, 32), e.storeUint(i9.queryId, 64), e.store(we(i9.draft));
  };
}
function Te(i9) {
  return (t) => {
    let e = t;
    e.storeUint(2669413677, 32), e.storeUint(i9.queryId, 64), e.storeInt(i9.optionId, 257), e.storeAddress(i9.holder);
  };
}
function Ne(i9) {
  return (t) => {
    let e = t;
    e.storeUint(4281832964, 32), e.storeUint(i9.queryId, 64);
  };
}
function qe(i9) {
  return (t) => {
    let e = t;
    e.storeUint(402709524, 32), e.storeUint(i9.queryId, 64);
  };
}
function Ee(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1344539513, 32), e.storeUint(i9.queryId, 64);
  };
}
function _e(i9) {
  return (t) => {
    let e = t;
    e.storeUint(2253786793, 32), e.storeUint(i9.queryId, 64);
  };
}
function ke(i9) {
  return (t) => {
    let e = t;
    e.storeAddress(i9.owner), e.storeAddress(i9.stream);
  };
}
async function V(i9, t) {
  let e = Cell.fromBase64("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"), n = Cell.fromBase64("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"), r = beginCell$1();
  r.storeRef(n), r.storeUint(0, 1), ke({ $$type: "Broker_init_args", owner: i9, stream: t })(r);
  let o = r.endCell();
  return { code: e, data: o };
}
var Ue = { 2: { message: "Stack underflow" }, 3: { message: "Stack overflow" }, 4: { message: "Integer overflow" }, 5: { message: "Integer out of expected range" }, 6: { message: "Invalid opcode" }, 7: { message: "Type check error" }, 8: { message: "Cell overflow" }, 9: { message: "Cell underflow" }, 10: { message: "Dictionary error" }, 13: { message: "Out of gas error" }, 32: { message: "Method ID not found" }, 34: { message: "Action is invalid or not supported" }, 37: { message: "Not enough TON" }, 38: { message: "Not enough extra-currencies" }, 128: { message: "Null reference exception" }, 129: { message: "Invalid serialization prefix" }, 130: { message: "Invalid incoming message" }, 131: { message: "Constraints error" }, 132: { message: "Access denied" }, 133: { message: "Contract stopped" }, 134: { message: "Invalid argument" }, 135: { message: "Code of a contract was not found" }, 136: { message: "Invalid address" }, 137: { message: "Masterchain support is not enabled for this contract" } }, $e = [{ name: "StateInit", header: null, fields: [{ name: "code", type: { kind: "simple", type: "cell", optional: false } }, { name: "data", type: { kind: "simple", type: "cell", optional: false } }] }, { name: "Context", header: null, fields: [{ name: "bounced", type: { kind: "simple", type: "bool", optional: false } }, { name: "sender", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "raw", type: { kind: "simple", type: "slice", optional: false } }] }, { name: "SendParameters", header: null, fields: [{ name: "bounce", type: { kind: "simple", type: "bool", optional: false } }, { name: "to", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "mode", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "body", type: { kind: "simple", type: "cell", optional: true } }, { name: "code", type: { kind: "simple", type: "cell", optional: true } }, { name: "data", type: { kind: "simple", type: "cell", optional: true } }] }, { name: "DSTDeploy", header: 306133030, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySuccess", header: 3957924127, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatch", header: 3012477066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatchSuccess", header: 1261138638, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTDeploySession", header: 1658160529, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySessionSuccess", header: 3452518278, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTSubscribe", header: 3216336466, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTSubscribeSuccess", header: 3770107736, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "Candlestick", header: null, fields: [{ name: "start", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "end", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "open", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "close", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "high", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "low", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTPublishCandlestick", header: 990592317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }] }, { name: "DSTPublishCandlestickSuccess", header: 215123525, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTUnsubscribedNotification", header: 1287102660, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBDeploy", header: 4267613765, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBDeploySuccess", header: 1031311118, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batchId", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribe", header: 2001551522, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribeSuccess", header: 4082513223, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestick", header: 4051052066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "publisher", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SBCandlestickPublishedNotification", header: 4175431181, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBUnsubscribedNotification", header: 1003141156, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestickSuccess", header: 1027631690, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploy", header: 1372687436, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploySuccess", header: 269942218, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SESSubscribe", header: 1533823831, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTTopUpSubscription", header: 495971614, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBTopUpSubscription", header: 267884312, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESSubscribeSuccess", header: 1400038355, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESCandlestickPublishedNotification", header: 3200926804, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribedNotification", header: 4092566650, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribe", header: 2668625285, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBUnsubscribe", header: 1095850324, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroy", header: 2226780297, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroySuccess", header: 21916563, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploy", header: 4195386677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploySuccess", header: 3142995347, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeployBroker", header: 298971134, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeploy", header: 1366331229, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDeploySuccess", header: 2536416450, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployBrokerSuccess", header: 4042145317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "broker", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccount", header: 3233956202, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploy", header: 1181556865, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploySuccess", header: 3517832790, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "trader", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccountSuccess", header: 1962963078, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "account", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeposit", header: 2141827764, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDepositSuccess", header: 2064422216, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdraw", header: 550691255, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdrawSuccess", header: 2654800410, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "Fraction", header: null, fields: [{ name: "nominator", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "denominator", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "CashOrNothingOptionDraftAgreement", header: null, fields: [{ name: "holder", type: { kind: "simple", type: "address", optional: false } }, { name: "initiation", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "expiration", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "optionType", type: { kind: "simple", type: "bool", optional: false } }, { name: "investment", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "BrokerDeployOption", header: 1174791129, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "draft", type: { kind: "simple", type: "CashOrNothingOptionDraftAgreement", optional: false } }] }, { name: "BrokerDeployOptionSuccess", header: 2438374427, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }, { name: "option", type: { kind: "simple", type: "address", optional: false } }] }, { name: "CashOrNothingOptionDeploy", header: 3343868548, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }, { name: "agreement", type: { kind: "simple", type: "CashOrNothingOptionAgreement", optional: false } }] }, { name: "CashOrNothingOptionDeploySuccess", header: 2669413677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "optionId", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "holder", type: { kind: "simple", type: "address", optional: false } }] }, { name: "CashOrNothingOptionSettledInMoneyNotification", header: 4281832964, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionSettledOutMoneyNotification", header: 402709524, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionSettledAtMoneyNotification", header: 1344539513, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionAgreement", header: null, fields: [{ name: "holder", type: { kind: "simple", type: "address", optional: false } }, { name: "writer", type: { kind: "simple", type: "address", optional: false } }, { name: "initiation", type: { kind: "simple", type: "uint", optional: false, format: 32 } }, { name: "expiration", type: { kind: "simple", type: "uint", optional: false, format: 32 } }, { name: "optionType", type: { kind: "simple", type: "bool", optional: false } }, { name: "investment", type: { kind: "simple", type: "uint", optional: false, format: "coins" } }, { name: "payout", type: { kind: "simple", type: "uint", optional: false, format: "coins" } }] }, { name: "SubscriberDestroyedNotification", header: 2253786793, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberCheckTimeout", header: 1397988627, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberTimeoutExceeded", header: 2857706980, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }], Pe = [{ name: "balance", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "storageReserve", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "depositDeposit", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "owner", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "stream", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "payout", arguments: [], returnType: { kind: "simple", type: "Fraction", optional: false } }, { name: "payoutRatio", arguments: [], returnType: { kind: "simple", type: "Fraction", optional: false } }, { name: "nextOptionId", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "optionAddress", arguments: [{ name: "optionId", type: { kind: "simple", type: "int", optional: false, format: 257 } }], returnType: { kind: "simple", type: "address", optional: false } }], xe = [{ receiver: "internal", message: { kind: "typed", type: "BRKDeploy" } }, { receiver: "internal", message: { kind: "typed", type: "BRKDeposit" } }, { receiver: "internal", message: { kind: "typed", type: "BRKWithdraw" } }, { receiver: "internal", message: { kind: "typed", type: "BrokerDeployOption" } }, { receiver: "internal", message: { kind: "typed", type: "CashOrNothingOptionDeploySuccess" } }, { receiver: "internal", message: { kind: "typed", type: "CashOrNothingOptionSettledInMoneyNotification" } }, { receiver: "internal", message: { kind: "typed", type: "CashOrNothingOptionSettledOutMoneyNotification" } }, { receiver: "internal", message: { kind: "typed", type: "CashOrNothingOptionSettledAtMoneyNotification" } }, { receiver: "internal", message: { kind: "typed", type: "SubscriberDestroyedNotification" } }], R = class i {
  constructor(t, e) {
    this.abi = { types: $e, getters: Pe, receivers: xe, errors: Ue };
    this.address = t, this.init = e;
  }
  static async init(t, e) {
    return await V(t, e);
  }
  static async fromInit(t, e) {
    let n = await V(t, e), r = contractAddress(0, n);
    return new i(r, n);
  }
  static fromAddress(t) {
    return new i(t);
  }
  async send(t, e, n, r) {
    let o = null;
    if (r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BRKDeploy" && (o = beginCell$1().store(Ae(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BRKDeposit" && (o = beginCell$1().store(De(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BRKWithdraw" && (o = beginCell$1().store(Ce(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BrokerDeployOption" && (o = beginCell$1().store(O(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "CashOrNothingOptionDeploySuccess" && (o = beginCell$1().store(Te(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "CashOrNothingOptionSettledInMoneyNotification" && (o = beginCell$1().store(Ne(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "CashOrNothingOptionSettledOutMoneyNotification" && (o = beginCell$1().store(qe(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "CashOrNothingOptionSettledAtMoneyNotification" && (o = beginCell$1().store(Ee(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SubscriberDestroyedNotification" && (o = beginCell$1().store(_e(r)).endCell()), o === null) throw new Error("Invalid message type");
    await t.internal(e, { ...n, body: o });
  }
  async getBalance(t) {
    let e = new TupleBuilder();
    return (await t.get("balance", e.build())).stack.readBigNumber();
  }
  async getStorageReserve(t) {
    let e = new TupleBuilder();
    return (await t.get("storageReserve", e.build())).stack.readBigNumber();
  }
  async getDepositDeposit(t) {
    let e = new TupleBuilder();
    return (await t.get("depositDeposit", e.build())).stack.readBigNumber();
  }
  async getOwner(t) {
    let e = new TupleBuilder();
    return (await t.get("owner", e.build())).stack.readAddress();
  }
  async getStream(t) {
    let e = new TupleBuilder();
    return (await t.get("stream", e.build())).stack.readAddress();
  }
  async getPayout(t) {
    let e = new TupleBuilder(), n = (await t.get("payout", e.build())).stack;
    return L(n);
  }
  async getPayoutRatio(t) {
    let e = new TupleBuilder(), n = (await t.get("payoutRatio", e.build())).stack;
    return L(n);
  }
  async getNextOptionId(t) {
    let e = new TupleBuilder();
    return (await t.get("nextOptionId", e.build())).stack.readBigNumber();
  }
  async getOptionAddress(t, e) {
    let n = new TupleBuilder();
    return n.writeNumber(e), (await t.get("optionAddress", n.build())).stack.readAddress();
  }
};
function ve(i9) {
  return (t) => {
    let e = t;
    e.storeUint(4195386677, 32), e.storeUint(i9.queryId, 64);
  };
}
function Ge(i9) {
  return (t) => {
    let e = t;
    e.storeUint(298971134, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.stream);
  };
}
function Me(i9) {
  return (t) => {
    let e = t;
    e.storeUint(2536416450, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.stream);
  };
}
function Le(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3233956202, 32), e.storeUint(i9.queryId, 64);
  };
}
function Ve(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3517832790, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.trader);
  };
}
function Oe(i9) {
  return (t) => {
    t.storeAddress(i9.owner);
  };
}
async function H(i9) {
  let t = Cell.fromBase64("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"), e = Cell.fromBase64("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"), n = beginCell$1();
  n.storeRef(e), n.storeUint(0, 1), Oe({ $$type: "Brokerage_init_args", owner: i9 })(n);
  let r = n.endCell();
  return { code: t, data: r };
}
var ze = { 2: { message: "Stack underflow" }, 3: { message: "Stack overflow" }, 4: { message: "Integer overflow" }, 5: { message: "Integer out of expected range" }, 6: { message: "Invalid opcode" }, 7: { message: "Type check error" }, 8: { message: "Cell overflow" }, 9: { message: "Cell underflow" }, 10: { message: "Dictionary error" }, 13: { message: "Out of gas error" }, 32: { message: "Method ID not found" }, 34: { message: "Action is invalid or not supported" }, 37: { message: "Not enough TON" }, 38: { message: "Not enough extra-currencies" }, 128: { message: "Null reference exception" }, 129: { message: "Invalid serialization prefix" }, 130: { message: "Invalid incoming message" }, 131: { message: "Constraints error" }, 132: { message: "Access denied" }, 133: { message: "Contract stopped" }, 134: { message: "Invalid argument" }, 135: { message: "Code of a contract was not found" }, 136: { message: "Invalid address" }, 137: { message: "Masterchain support is not enabled for this contract" } }, He = [{ name: "StateInit", header: null, fields: [{ name: "code", type: { kind: "simple", type: "cell", optional: false } }, { name: "data", type: { kind: "simple", type: "cell", optional: false } }] }, { name: "Context", header: null, fields: [{ name: "bounced", type: { kind: "simple", type: "bool", optional: false } }, { name: "sender", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "raw", type: { kind: "simple", type: "slice", optional: false } }] }, { name: "SendParameters", header: null, fields: [{ name: "bounce", type: { kind: "simple", type: "bool", optional: false } }, { name: "to", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "mode", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "body", type: { kind: "simple", type: "cell", optional: true } }, { name: "code", type: { kind: "simple", type: "cell", optional: true } }, { name: "data", type: { kind: "simple", type: "cell", optional: true } }] }, { name: "DSTDeploy", header: 306133030, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySuccess", header: 3957924127, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatch", header: 3012477066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatchSuccess", header: 1261138638, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTDeploySession", header: 1658160529, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySessionSuccess", header: 3452518278, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTSubscribe", header: 3216336466, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTSubscribeSuccess", header: 3770107736, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "Candlestick", header: null, fields: [{ name: "start", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "end", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "open", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "close", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "high", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "low", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTPublishCandlestick", header: 990592317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }] }, { name: "DSTPublishCandlestickSuccess", header: 215123525, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTUnsubscribedNotification", header: 1287102660, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBDeploy", header: 4267613765, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBDeploySuccess", header: 1031311118, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batchId", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribe", header: 2001551522, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribeSuccess", header: 4082513223, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestick", header: 4051052066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "publisher", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SBCandlestickPublishedNotification", header: 4175431181, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBUnsubscribedNotification", header: 1003141156, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestickSuccess", header: 1027631690, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploy", header: 1372687436, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploySuccess", header: 269942218, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SESSubscribe", header: 1533823831, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTTopUpSubscription", header: 495971614, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBTopUpSubscription", header: 267884312, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESSubscribeSuccess", header: 1400038355, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESCandlestickPublishedNotification", header: 3200926804, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribedNotification", header: 4092566650, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribe", header: 2668625285, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBUnsubscribe", header: 1095850324, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroy", header: 2226780297, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroySuccess", header: 21916563, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploy", header: 4195386677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploySuccess", header: 3142995347, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeployBroker", header: 298971134, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeploy", header: 1366331229, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDeploySuccess", header: 2536416450, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployBrokerSuccess", header: 4042145317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "broker", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccount", header: 3233956202, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploy", header: 1181556865, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploySuccess", header: 3517832790, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "trader", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccountSuccess", header: 1962963078, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "account", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeposit", header: 2141827764, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDepositSuccess", header: 2064422216, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdraw", header: 550691255, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdrawSuccess", header: 2654800410, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "Fraction", header: null, fields: [{ name: "nominator", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "denominator", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "CashOrNothingOptionDraftAgreement", header: null, fields: [{ name: "holder", type: { kind: "simple", type: "address", optional: false } }, { name: "initiation", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "expiration", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "optionType", type: { kind: "simple", type: "bool", optional: false } }, { name: "investment", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "BrokerDeployOption", header: 1174791129, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "draft", type: { kind: "simple", type: "CashOrNothingOptionDraftAgreement", optional: false } }] }, { name: "BrokerDeployOptionSuccess", header: 2438374427, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }, { name: "option", type: { kind: "simple", type: "address", optional: false } }] }, { name: "CashOrNothingOptionDeploy", header: 3343868548, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }, { name: "agreement", type: { kind: "simple", type: "CashOrNothingOptionAgreement", optional: false } }] }, { name: "CashOrNothingOptionDeploySuccess", header: 2669413677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "optionId", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "holder", type: { kind: "simple", type: "address", optional: false } }] }, { name: "CashOrNothingOptionSettledInMoneyNotification", header: 4281832964, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionSettledOutMoneyNotification", header: 402709524, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionSettledAtMoneyNotification", header: 1344539513, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionAgreement", header: null, fields: [{ name: "holder", type: { kind: "simple", type: "address", optional: false } }, { name: "writer", type: { kind: "simple", type: "address", optional: false } }, { name: "initiation", type: { kind: "simple", type: "uint", optional: false, format: 32 } }, { name: "expiration", type: { kind: "simple", type: "uint", optional: false, format: 32 } }, { name: "optionType", type: { kind: "simple", type: "bool", optional: false } }, { name: "investment", type: { kind: "simple", type: "uint", optional: false, format: "coins" } }, { name: "payout", type: { kind: "simple", type: "uint", optional: false, format: "coins" } }] }, { name: "SubscriberDestroyedNotification", header: 2253786793, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberCheckTimeout", header: 1397988627, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberTimeoutExceeded", header: 2857706980, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }], Ke = [{ name: "storageReserve", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "owner", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "broker", arguments: [{ name: "stream", type: { kind: "simple", type: "address", optional: false } }], returnType: { kind: "simple", type: "address", optional: false } }, { name: "account", arguments: [{ name: "trader", type: { kind: "simple", type: "address", optional: false } }], returnType: { kind: "simple", type: "address", optional: false } }], Je = [{ receiver: "internal", message: { kind: "typed", type: "BRGDeploy" } }, { receiver: "internal", message: { kind: "typed", type: "BRGDeployBroker" } }, { receiver: "internal", message: { kind: "typed", type: "BRKDeploySuccess" } }, { receiver: "internal", message: { kind: "typed", type: "BRGDeployAccount" } }, { receiver: "internal", message: { kind: "typed", type: "BRADeploySuccess" } }], _ = class i2 {
  constructor(t, e) {
    this.abi = { types: He, getters: Ke, receivers: Je, errors: ze };
    this.address = t, this.init = e;
  }
  static async init(t) {
    return await H(t);
  }
  static async fromInit(t) {
    let e = await H(t), n = contractAddress(0, e);
    return new i2(n, e);
  }
  static fromAddress(t) {
    return new i2(t);
  }
  async send(t, e, n, r) {
    let o = null;
    if (r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BRGDeploy" && (o = beginCell$1().store(ve(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BRGDeployBroker" && (o = beginCell$1().store(Ge(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BRKDeploySuccess" && (o = beginCell$1().store(Me(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BRGDeployAccount" && (o = beginCell$1().store(Le(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BRADeploySuccess" && (o = beginCell$1().store(Ve(r)).endCell()), o === null) throw new Error("Invalid message type");
    await t.internal(e, { ...n, body: o });
  }
  async getStorageReserve(t) {
    let e = new TupleBuilder();
    return (await t.get("storageReserve", e.build())).stack.readBigNumber();
  }
  async getOwner(t) {
    let e = new TupleBuilder();
    return (await t.get("owner", e.build())).stack.readAddress();
  }
  async getBroker(t, e) {
    let n = new TupleBuilder();
    return n.writeAddress(e), (await t.get("broker", n.build())).stack.readAddress();
  }
  async getAccount(t, e) {
    let n = new TupleBuilder();
    return n.writeAddress(e), (await t.get("account", n.build())).stack.readAddress();
  }
};
function We(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1181556865, 32), e.storeUint(i9.queryId, 64);
  };
}
function Xe(i9) {
  return (t) => {
    let e = t;
    e.storeAddress(i9.brokerage), e.storeAddress(i9.trader);
  };
}
async function J(i9, t) {
  let e = Cell.fromBase64("te6ccgECGAEAA5oAART/APSkE/S88sgLAQIBYgIDA3jQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxa2zzy4IIVBAUCASAJCgHqAZIwf+BwIddJwh+VMCDXCx/eghBGbSCBuo7X0x8BghBGbSCBuvLggdM/ATH4QW8kECNfA1IwxwXy4ZAhyFmCENGt3lZQA8sfyz8BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyfhCAXBt2zx/4DBwBgCWyPhDAcx/AcoAWVkg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8Wye1UAo5tbSJus5lbIG7y0IBvIgGRMuL4QW8kE18D+CdvEAGhggiYloC5jpSCCJiWgHD7AhAkcAMEgQCCUCPbPOAQJHADBIBCUCPbPAcHAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7AAgAmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwCAWYLDAIBIA8QAhGwkfbPNs8bCGAVDQIRsPS2zzbPGwhgFQ4ACoIImJaAAAIhAJW7vRgnBc7D1dLK57HoTsOdZKhRtmgnCd1jUtK2R8syLTry398WI5gnAgVcAbgGdjlM5YOq5HJbLDgnCdl05as07LczoOlm2UZuikgCAUgREgARsK+7UTQ0gABgAgJ0ExQCDfG2ebZ42EMVFgBzou40NWlwZnM6Ly9RbVdpQnltUVJOOHQxYktCc01HZnBvTWpZQTFHejYyWk1HaFR0RnVMN2IxaDRUggG07UTQ1AH4Y9IAAY5C+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIEmwS4Pgo1wsKgwm68uCJFwACIACG+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIEgLRAQ=="), n = Cell.fromBase64("te6cckECGgEAA6QAAQHAAQEFoIbNAgEU/wD0pBP0vPLICwMCAWIECgN40AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8Wts88uCCFgUJAeoBkjB/4HAh10nCH5UwINcLH96CEEZtIIG6jtfTHwGCEEZtIIG68uCB0z8BMfhBbyQQI18DUjDHBfLhkCHIWYIQ0a3eVlADyx/LPwEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJ+EIBcG3bPH/gMHAGAo5tbSJus5lbIG7y0IBvIgGRMuL4QW8kE18D+CdvEAGhggiYloC5jpSCCJiWgHD7AhAkcAMEgQCCUCPbPOAQJHADBIBCUCPbPAcHAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7AAgAmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwAlsj4QwHMfwHKAFlZINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsntVAIBIAsQAgFmDA4CEbCR9s82zxsIYBYNAAqCCJiWgAIRsPS2zzbPGwhgFg8AAiECASAREgCVu70YJwXOw9XSyuex6E7DnWSoUbZoJwndY1LStkfLMi068t/fFiOYJwIFXAG4BnY5TOWDquRyWyw4JwnZdOWrNOy3M6DpZtlGbopIAgFIExQAEbCvu1E0NIAAYAICdBUZAg3xtnm2eNhDFhgBtO1E0NQB+GPSAAGOQvpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiBJsEuD4KNcLCoMJuvLgiRcAhvpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiBIC0QEAAiAAc6LuNDVpcGZzOi8vUW1XaUJ5bVFSTjh0MWJLQnNNR2Zwb01qWUExR3o2MlpNR2hUdEZ1TDdiMWg0VIL3VL1B"), r = beginCell$1();
  r.storeRef(n), r.storeUint(0, 1), Xe({ $$type: "BrokerageAccount_init_args", brokerage: i9, trader: t })(r);
  let o = r.endCell();
  return { code: e, data: o };
}
var je = { 2: { message: "Stack underflow" }, 3: { message: "Stack overflow" }, 4: { message: "Integer overflow" }, 5: { message: "Integer out of expected range" }, 6: { message: "Invalid opcode" }, 7: { message: "Type check error" }, 8: { message: "Cell overflow" }, 9: { message: "Cell underflow" }, 10: { message: "Dictionary error" }, 13: { message: "Out of gas error" }, 32: { message: "Method ID not found" }, 34: { message: "Action is invalid or not supported" }, 37: { message: "Not enough TON" }, 38: { message: "Not enough extra-currencies" }, 128: { message: "Null reference exception" }, 129: { message: "Invalid serialization prefix" }, 130: { message: "Invalid incoming message" }, 131: { message: "Constraints error" }, 132: { message: "Access denied" }, 133: { message: "Contract stopped" }, 134: { message: "Invalid argument" }, 135: { message: "Code of a contract was not found" }, 136: { message: "Invalid address" }, 137: { message: "Masterchain support is not enabled for this contract" } }, Ze = [{ name: "StateInit", header: null, fields: [{ name: "code", type: { kind: "simple", type: "cell", optional: false } }, { name: "data", type: { kind: "simple", type: "cell", optional: false } }] }, { name: "Context", header: null, fields: [{ name: "bounced", type: { kind: "simple", type: "bool", optional: false } }, { name: "sender", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "raw", type: { kind: "simple", type: "slice", optional: false } }] }, { name: "SendParameters", header: null, fields: [{ name: "bounce", type: { kind: "simple", type: "bool", optional: false } }, { name: "to", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "mode", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "body", type: { kind: "simple", type: "cell", optional: true } }, { name: "code", type: { kind: "simple", type: "cell", optional: true } }, { name: "data", type: { kind: "simple", type: "cell", optional: true } }] }, { name: "DSTDeploy", header: 306133030, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySuccess", header: 3957924127, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatch", header: 3012477066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatchSuccess", header: 1261138638, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTDeploySession", header: 1658160529, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySessionSuccess", header: 3452518278, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTSubscribe", header: 3216336466, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTSubscribeSuccess", header: 3770107736, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "Candlestick", header: null, fields: [{ name: "start", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "end", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "open", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "close", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "high", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "low", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTPublishCandlestick", header: 990592317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }] }, { name: "DSTPublishCandlestickSuccess", header: 215123525, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTUnsubscribedNotification", header: 1287102660, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBDeploy", header: 4267613765, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBDeploySuccess", header: 1031311118, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batchId", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribe", header: 2001551522, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribeSuccess", header: 4082513223, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestick", header: 4051052066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "publisher", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SBCandlestickPublishedNotification", header: 4175431181, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBUnsubscribedNotification", header: 1003141156, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestickSuccess", header: 1027631690, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploy", header: 1372687436, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploySuccess", header: 269942218, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SESSubscribe", header: 1533823831, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTTopUpSubscription", header: 495971614, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBTopUpSubscription", header: 267884312, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESSubscribeSuccess", header: 1400038355, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESCandlestickPublishedNotification", header: 3200926804, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribedNotification", header: 4092566650, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribe", header: 2668625285, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBUnsubscribe", header: 1095850324, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroy", header: 2226780297, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroySuccess", header: 21916563, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploy", header: 4195386677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploySuccess", header: 3142995347, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeployBroker", header: 298971134, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeploy", header: 1366331229, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDeploySuccess", header: 2536416450, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployBrokerSuccess", header: 4042145317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "broker", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccount", header: 3233956202, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploy", header: 1181556865, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploySuccess", header: 3517832790, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "trader", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccountSuccess", header: 1962963078, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "account", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeposit", header: 2141827764, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDepositSuccess", header: 2064422216, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdraw", header: 550691255, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdrawSuccess", header: 2654800410, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "Fraction", header: null, fields: [{ name: "nominator", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "denominator", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "CashOrNothingOptionDraftAgreement", header: null, fields: [{ name: "holder", type: { kind: "simple", type: "address", optional: false } }, { name: "initiation", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "expiration", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "optionType", type: { kind: "simple", type: "bool", optional: false } }, { name: "investment", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "BrokerDeployOption", header: 1174791129, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "draft", type: { kind: "simple", type: "CashOrNothingOptionDraftAgreement", optional: false } }] }, { name: "BrokerDeployOptionSuccess", header: 2438374427, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }, { name: "option", type: { kind: "simple", type: "address", optional: false } }] }, { name: "CashOrNothingOptionDeploy", header: 3343868548, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }, { name: "agreement", type: { kind: "simple", type: "CashOrNothingOptionAgreement", optional: false } }] }, { name: "CashOrNothingOptionDeploySuccess", header: 2669413677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "optionId", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "holder", type: { kind: "simple", type: "address", optional: false } }] }, { name: "CashOrNothingOptionSettledInMoneyNotification", header: 4281832964, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionSettledOutMoneyNotification", header: 402709524, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionSettledAtMoneyNotification", header: 1344539513, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionAgreement", header: null, fields: [{ name: "holder", type: { kind: "simple", type: "address", optional: false } }, { name: "writer", type: { kind: "simple", type: "address", optional: false } }, { name: "initiation", type: { kind: "simple", type: "uint", optional: false, format: 32 } }, { name: "expiration", type: { kind: "simple", type: "uint", optional: false, format: 32 } }, { name: "optionType", type: { kind: "simple", type: "bool", optional: false } }, { name: "investment", type: { kind: "simple", type: "uint", optional: false, format: "coins" } }, { name: "payout", type: { kind: "simple", type: "uint", optional: false, format: "coins" } }] }, { name: "SubscriberDestroyedNotification", header: 2253786793, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberCheckTimeout", header: 1397988627, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberTimeoutExceeded", header: 2857706980, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }], et = [{ name: "storageReserve", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "brokerage", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "trader", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }], tt = [{ receiver: "internal", message: { kind: "typed", type: "BRADeploy" } }], U = class i3 {
  constructor(t, e) {
    this.abi = { types: Ze, getters: et, receivers: tt, errors: je };
    this.address = t, this.init = e;
  }
  static async init(t, e) {
    return await J(t, e);
  }
  static async fromInit(t, e) {
    let n = await J(t, e), r = contractAddress(0, n);
    return new i3(r, n);
  }
  static fromAddress(t) {
    return new i3(t);
  }
  async send(t, e, n, r) {
    let o = null;
    if (r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "BRADeploy" && (o = beginCell$1().store(We(r)).endCell()), o === null) throw new Error("Invalid message type");
    await t.internal(e, { ...n, body: o });
  }
  async getStorageReserve(t) {
    let e = new TupleBuilder();
    return (await t.get("storageReserve", e.build())).stack.readBigNumber();
  }
  async getBrokerage(t) {
    let e = new TupleBuilder();
    return (await t.get("brokerage", e.build())).stack.readAddress();
  }
  async getTrader(t) {
    let e = new TupleBuilder();
    return (await t.get("trader", e.build())).stack.readAddress();
  }
};
function it(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3452518278, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.session);
  };
}
function nt(i9) {
  return (t) => {
    let e = t;
    e.storeInt(i9.start, 257), e.storeInt(i9.end, 257), e.storeInt(i9.open, 257);
    let n = new Builder();
    n.storeInt(i9.close, 257), n.storeInt(i9.high, 257), n.storeInt(i9.low, 257), e.storeRef(n.endCell());
  };
}
function ot(i9) {
  let t = i9.readBigNumber(), e = i9.readBigNumber(), n = i9.readBigNumber(), r = i9.readBigNumber(), o = i9.readBigNumber(), B = i9.readBigNumber();
  return { $$type: "Candlestick", start: t, end: e, open: n, close: r, high: o, low: B };
}
function st(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1400038355, 32), e.storeUint(i9.queryId, 64), e.storeInt(i9.remainingNotificationsCount, 257);
  };
}
function lt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3200926804, 32), e.storeUint(i9.queryId, 64), e.store(nt(i9.candlestick));
    let n = new Builder();
    n.storeInt(i9.remainingNotificationsCount, 257), e.storeRef(n.endCell());
  };
}
function ut(i9) {
  return (t) => {
    let e = t;
    e.storeUint(4092566650, 32), e.storeUint(i9.queryId, 64), e.storeInt(i9.remainingNotificationsCount, 257);
  };
}
function at(i9) {
  return (t) => {
    let e = t;
    e.storeUint(21916563, 32), e.storeUint(i9.queryId, 64);
  };
}
function dt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1397988627, 32), e.storeUint(i9.queryId, 64);
  };
}
function X(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3343868548, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.stream);
    let n = new Builder();
    n.store(ct(i9.agreement)), e.storeRef(n.endCell());
  };
}
function ct(i9) {
  return (t) => {
    let e = t;
    e.storeAddress(i9.holder), e.storeAddress(i9.writer), e.storeUint(i9.initiation, 32), e.storeUint(i9.expiration, 32), e.storeBit(i9.optionType), e.storeCoins(i9.investment), e.storeCoins(i9.payout);
  };
}
function pt(i9) {
  let t = i9.readAddress(), e = i9.readAddress(), n = i9.readBigNumber(), r = i9.readBigNumber(), o = i9.readBoolean(), B = i9.readBigNumber(), E = i9.readBigNumber();
  return { $$type: "CashOrNothingOptionAgreement", holder: t, writer: e, initiation: n, expiration: r, optionType: o, investment: B, payout: E };
}
function yt(i9) {
  return (t) => {
    let e = t;
    e.storeAddress(i9.deployer), e.storeInt(i9.optionId, 257);
  };
}
async function W(i9, t) {
  let e = Cell.fromBase64("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"), n = Cell.fromBase64("te6cckECSwEADMkAAQHAAQEFoWPjAgEU/wD0pBP0vPLICwMCAWIEIgOa0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRnbPPLggsj4QwHMfwHKAFWQ2zzJ7VREBR0EyAHjAnAh10nCH5UwINcLH94gghDHT2KEuo9BMNMfAYIQx09ihLry4IHTP/pAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB1AHQ2zw3EHkQeFUFbBnbPH/gIIIQzck/hroGRwgNBPCAINchcCHXScIflTAg1wsf3iCCEGLVhZG6jpUw0x8BghBi1YWRuvLggdM/ATHbPH/gIIIQW2xLV7qOlTDTHwGCEFtsS1e68uCB0z8BMds8f+AgghCfD/2Fuo6VMNMfAYIQnw/9hbry4IHTPwEx2zx/4IIQhLn4iboXFxcHATKOlNMfAYIQhLn4ibry4IHTPwEx2zx/4DB/FwPy+EFvJBAjXwNWEwHHBfLhkFR2VFR2VCYREBEZERAPERgPDhEXDg0RFg0MERUMCxEUCwoREwoJERIJCBERCAcRGQfbPDMuTtNUXMtWFG8HKfgjoYA8qQSmAhB8EGsQWhBJEDhHYEVAVBMPTxPbPFC9oHT7AnBRs4MGCwkKDAAwMjQ0IfgjvPLhlLny4ZTCAPLhlMIA8uGUAYA5Ojr4QW8kE18DKcIB8uGUghAO5rKAggnJw4ArqKC+8uGRKBCrEJtVcNs8ghAI8NGAggnJw4BQDKgboHT7AlUICwFMKSBu8tCAghAF9eEAgBEDyAGCEGLVhZFYyx/LP8lBMH9VMG1t2zwbAZjIVSCCEJ8cBS1QBMsfEss/gQEBzwABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyShME1Cqf1UwbW3bPBBZEEgQN0YUQDMFGwP+jrIw0x8BghDNyT+GuvLggdM/+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiBJsEuAgghBTcuPTuo6+MNMfAYIQU3Lj07ry4IHTP4EBAdcAWWwS+EFvJBAjXwMpIG7y0IABxwXy4ZBSkCFuklt/kb3ijoLbPJEw4n/gIA4aDwGsOPhBbyQQI18DUqAhbpJbcJLHBeLy4ZAnIG7y0ICCCvrwgIIJycOAKyBu8tCAqKCAESsgbvLQgBTIWYIQW2xLV1ADyx/LP4EBAc8AyUEwf1UwbW3bPH8bBKqCEL7KRFS6jzow0x8BghC+ykRUuvLggdM/2zwG1AHQgQEB1wAwGBdsGDD4QW8kECNfAy4gbvLQgAHHBfLhkPgA2zx/4CCCEPPvnHq64wIggglOa5O6SBAUFgPKN/hBbyQQI18DLSBu8tCAAccF8uGQJFREMCRUEiEKbwYoIG7y0IBvJxBGXwYUupE2kTDiJiBu8tCAbycQNl8Guo+fJG6OhzJVkCrbPDHjDhCJEHgQZxBWEEUQNEEwfwLbPJJsIeIZERoDpiUgbvLQgG8nECZfBsD/mSQgbvLQgFIwvpFw4o6HMlWQKts8MY8sJSBu8tCAbycQJl8GwACYJCBu8tCAE7uSMnDijoZVkCrbPDGOhlWQKts8MeLiEhITAs4kIG7y0IBvJ18GggkxLQAmIG7y0IBvJxZfBqAmIG7y0IBvJ2xhoHMjyAGCEP83lgRYyx/LP8l/VTBtbds8JCBu8tCAbycQVl8GggkxLQBzA8gBghD/N5YEWMsfyz/JQTB/VTBtbds8GxsCziQgbvLQgG8nXwaCCTEtAHMjyAGCEBgA3BRYyx/LP8l/VTBtbds8JCBu8tCAbycQVl8GggkxLQAmIG7y0IBvJxZfBqAmIG7y0IBvJ2xhoHMDyAGCEBgA3BRYyx/LP8lBMH9VMG1t2zwbGwFkMNMfAYIQ8++cerry4IHTP4EBAdcAWWwSMPhBbyQQI18DKCBu8tCAAccF8uGQ+ADbPH8VAUonIG7y0ICCCvrwgIARA8gBghCEufiJWMsfyz/JQTB/VTBtbds8GwP2jqgw0x8BgglOa5O68uCB0z8BMfhBbyQQI18DKCBu8tCAAccF8uGQ2zx/4IIQU1OdE7qPRNMfAYIQU1OdE7ry4IHTPwEx+CMnIG7y0ICBDhCgvPLhm/hBbyQwMoARI8gBghCqVSXkWMsfyz/JECN/VTBtbds82zx/4DBwFxsaAkpVkCrbPHCBAKAMyAGCEIZWDqlYyx/LP8krA1Ddf1UwbW3bPFUIGBsBEiKzjoLbPJEw4hkCziQgbvLQgG8nXwaCCTEtACYgbvLQgG8nFl8GoHMjyAGCEFAkC3lYyx/LP8l/VTBtbds8JCBu8tCAbycQVl8GggkxLQAmIG7y0IBvJ2xhoHMDyAGCEFAkC3lYyx/LP8lBMH9VMG1t2zwbGwFIJyBu8tCAggr68IBxA8gBghCfD/2FWMsfyz/JQTB/VTBtbds8GwHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wAcAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAchQqSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAHIG6VMHABywGOHiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFuIlbrOafwHKABWBAQHPAJY1cFAFygDiyFAEHgL+IG6VMHABywGOHiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFuIibrOafwHKABKBAQHPAJUycFjKAOKBAQHPAMgjbrOOkH8BygADIG7y0IBvJxB52zyWM3BQA8oA4sgkbrOafwHKABSBAQHPAJY0cFAEygDiFcoAyCRusx8gAJpQdiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAEINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WEssfyx/KAFj6AgH6AgFOjpB/AcoABCBu8tCAbyYQads8ljRwUATKAOLJUAPMyQHMyQHMyQHMIQBQUFaBAQHPABOBAQHPAIEBAc8AAciBAQHPABKBAQHPABKBAQHPAMkBzAIBICMuAgEgJCkCASAlJwIRt7j7Z5tnjZQwRCYAAigCEbYqW2ebZ42UMEQoAAIiAgFIKiwCEbFyts82zxsoYEQrAAIlAhGzK3bPNs8bKGBELQACJwIBIC8/AgEgMDsCASAxMwI9sbW2zzbPGyhIG6SMG2ZIG7y0IBvJm8G4iBukjBt3oEQyAAIgAgEgNDkCAW41NwIPowNs82zxsoZENgAI+CdvEAIPoTds82zxsoZEOAACKQI9rqftnm2eNlCQN0kYNsyQN3loQDeTt4PxEDdJGDbvQEQ6AAIjAgFYPD4CEa5TbZ5tnjZQwEQ9AAIkAJWt6ME4LnYerpZXPY9CdhzrJUKNs0E4TusalpWyPlmRadeW/vixHME4ECrgDcAzscpnLB1XI5LZYcE4TsunLVmnZbmdB0s2yjN0UkACASBAQwIBIEFCABGwr7tRNDSAAGAAdbJu40NWlwZnM6Ly9RbWJrYWJHY2RCNGNtN1JaNHQ4NUFHVkNiRHI0NVBTTnRTTGlMdlVtUFB2YTdRggAhG2qFtnm2eNlDBESgKO7UTQ1AH4Y9IAAY6E2zxsGuD4KNcLCoMJuvLgifpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wBZAtEB2zxFSQG8+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAEg1wsBwwCOH/pAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IiUctchbeIB0gABlYEBAdcAkm0B4tQB0EYC9CDXCwHDAI4f+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJRy1yFt4gHSAAGVgQEB1wCSbQHigQEB1wDUMNDSAAGOhNs8bweRbeIB1DDQ0gABlYEBAdcAkm0B4tIA1DDQ0gABjobbPGwWbwaSMG3iEHoQeRB4R0gAmPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHTH9Mf0gD6APoAVWAAUIEBAdcAgQEB1wCBAQHXANQB0IEBAdcAgQEB1wCBAQHXADAQNhA1EDQAFm1tbUEwbVhtbXBtAAImt+ZuaA=="), r = beginCell$1();
  r.storeRef(n), r.storeUint(0, 1), yt({ $$type: "CashOrNothingOption_init_args", deployer: i9, optionId: t })(r);
  let o = r.endCell();
  return { code: e, data: o };
}
var bt = { 2: { message: "Stack underflow" }, 3: { message: "Stack overflow" }, 4: { message: "Integer overflow" }, 5: { message: "Integer out of expected range" }, 6: { message: "Invalid opcode" }, 7: { message: "Type check error" }, 8: { message: "Cell overflow" }, 9: { message: "Cell underflow" }, 10: { message: "Dictionary error" }, 13: { message: "Out of gas error" }, 32: { message: "Method ID not found" }, 34: { message: "Action is invalid or not supported" }, 37: { message: "Not enough TON" }, 38: { message: "Not enough extra-currencies" }, 128: { message: "Null reference exception" }, 129: { message: "Invalid serialization prefix" }, 130: { message: "Invalid incoming message" }, 131: { message: "Constraints error" }, 132: { message: "Access denied" }, 133: { message: "Contract stopped" }, 134: { message: "Invalid argument" }, 135: { message: "Code of a contract was not found" }, 136: { message: "Invalid address" }, 137: { message: "Masterchain support is not enabled for this contract" } }, St = [{ name: "StateInit", header: null, fields: [{ name: "code", type: { kind: "simple", type: "cell", optional: false } }, { name: "data", type: { kind: "simple", type: "cell", optional: false } }] }, { name: "Context", header: null, fields: [{ name: "bounced", type: { kind: "simple", type: "bool", optional: false } }, { name: "sender", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "raw", type: { kind: "simple", type: "slice", optional: false } }] }, { name: "SendParameters", header: null, fields: [{ name: "bounce", type: { kind: "simple", type: "bool", optional: false } }, { name: "to", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "mode", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "body", type: { kind: "simple", type: "cell", optional: true } }, { name: "code", type: { kind: "simple", type: "cell", optional: true } }, { name: "data", type: { kind: "simple", type: "cell", optional: true } }] }, { name: "DSTDeploy", header: 306133030, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySuccess", header: 3957924127, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatch", header: 3012477066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatchSuccess", header: 1261138638, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTDeploySession", header: 1658160529, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySessionSuccess", header: 3452518278, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTSubscribe", header: 3216336466, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTSubscribeSuccess", header: 3770107736, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "Candlestick", header: null, fields: [{ name: "start", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "end", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "open", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "close", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "high", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "low", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTPublishCandlestick", header: 990592317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }] }, { name: "DSTPublishCandlestickSuccess", header: 215123525, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTUnsubscribedNotification", header: 1287102660, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBDeploy", header: 4267613765, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBDeploySuccess", header: 1031311118, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batchId", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribe", header: 2001551522, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribeSuccess", header: 4082513223, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestick", header: 4051052066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "publisher", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SBCandlestickPublishedNotification", header: 4175431181, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBUnsubscribedNotification", header: 1003141156, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestickSuccess", header: 1027631690, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploy", header: 1372687436, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploySuccess", header: 269942218, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SESSubscribe", header: 1533823831, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTTopUpSubscription", header: 495971614, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBTopUpSubscription", header: 267884312, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESSubscribeSuccess", header: 1400038355, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESCandlestickPublishedNotification", header: 3200926804, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribedNotification", header: 4092566650, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribe", header: 2668625285, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBUnsubscribe", header: 1095850324, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroy", header: 2226780297, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroySuccess", header: 21916563, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploy", header: 4195386677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploySuccess", header: 3142995347, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeployBroker", header: 298971134, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeploy", header: 1366331229, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDeploySuccess", header: 2536416450, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployBrokerSuccess", header: 4042145317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "broker", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccount", header: 3233956202, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploy", header: 1181556865, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploySuccess", header: 3517832790, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "trader", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccountSuccess", header: 1962963078, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "account", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeposit", header: 2141827764, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDepositSuccess", header: 2064422216, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdraw", header: 550691255, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdrawSuccess", header: 2654800410, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberDestroyedNotification", header: 2253786793, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberCheckTimeout", header: 1397988627, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberTimeoutExceeded", header: 2857706980, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionDeploy", header: 3343868548, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }, { name: "agreement", type: { kind: "simple", type: "CashOrNothingOptionAgreement", optional: false } }] }, { name: "CashOrNothingOptionDeploySuccess", header: 2669413677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "optionId", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "holder", type: { kind: "simple", type: "address", optional: false } }] }, { name: "CashOrNothingOptionSettledInMoneyNotification", header: 4281832964, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionSettledOutMoneyNotification", header: 402709524, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionSettledAtMoneyNotification", header: 1344539513, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "CashOrNothingOptionAgreement", header: null, fields: [{ name: "holder", type: { kind: "simple", type: "address", optional: false } }, { name: "writer", type: { kind: "simple", type: "address", optional: false } }, { name: "initiation", type: { kind: "simple", type: "uint", optional: false, format: 32 } }, { name: "expiration", type: { kind: "simple", type: "uint", optional: false, format: 32 } }, { name: "optionType", type: { kind: "simple", type: "bool", optional: false } }, { name: "investment", type: { kind: "simple", type: "uint", optional: false, format: "coins" } }, { name: "payout", type: { kind: "simple", type: "uint", optional: false, format: "coins" } }] }], ft = [{ name: "optionId", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "agreement", arguments: [], returnType: { kind: "simple", type: "CashOrNothingOptionAgreement", optional: true } }, { name: "strikePrice", arguments: [], returnType: { kind: "simple", type: "int", optional: true, format: 257 } }, { name: "latestCandlestick", arguments: [], returnType: { kind: "simple", type: "Candlestick", optional: true } }, { name: "balance", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "deployerAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "streamAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: true } }, { name: "notificationsCount", arguments: [], returnType: { kind: "simple", type: "int", optional: true, format: 257 } }, { name: "expiration", arguments: [], returnType: { kind: "simple", type: "int", optional: true, format: 257 } }, { name: "sessionAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: true } }], Bt = [{ receiver: "internal", message: { kind: "typed", type: "CashOrNothingOptionDeploy" } }, { receiver: "internal", message: { kind: "typed", type: "DSTDeploySessionSuccess" } }, { receiver: "internal", message: { kind: "typed", type: "SESSubscribeSuccess" } }, { receiver: "internal", message: { kind: "typed", type: "SESCandlestickPublishedNotification" } }, { receiver: "internal", message: { kind: "typed", type: "SESUnsubscribedNotification" } }, { receiver: "internal", message: { kind: "typed", type: "SESDestroySuccess" } }, { receiver: "internal", message: { kind: "typed", type: "SubscriberCheckTimeout" } }], $ = class i4 {
  constructor(t, e) {
    this.abi = { types: St, getters: ft, receivers: Bt, errors: bt };
    this.address = t, this.init = e;
  }
  static async init(t, e) {
    return await W(t, e);
  }
  static async fromInit(t, e) {
    let n = await W(t, e), r = contractAddress(0, n);
    return new i4(r, n);
  }
  static fromAddress(t) {
    return new i4(t);
  }
  async send(t, e, n, r) {
    let o = null;
    if (r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "CashOrNothingOptionDeploy" && (o = beginCell$1().store(X(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTDeploySessionSuccess" && (o = beginCell$1().store(it(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESSubscribeSuccess" && (o = beginCell$1().store(st(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESCandlestickPublishedNotification" && (o = beginCell$1().store(lt(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESUnsubscribedNotification" && (o = beginCell$1().store(ut(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESDestroySuccess" && (o = beginCell$1().store(at(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SubscriberCheckTimeout" && (o = beginCell$1().store(dt(r)).endCell()), o === null) throw new Error("Invalid message type");
    await t.internal(e, { ...n, body: o });
  }
  async getOptionId(t) {
    let e = new TupleBuilder();
    return (await t.get("optionId", e.build())).stack.readBigNumber();
  }
  async getAgreement(t) {
    let e = new TupleBuilder(), r = (await t.get("agreement", e.build())).stack.readTupleOpt();
    return r ? pt(r) : null;
  }
  async getStrikePrice(t) {
    let e = new TupleBuilder();
    return (await t.get("strikePrice", e.build())).stack.readBigNumberOpt();
  }
  async getLatestCandlestick(t) {
    let e = new TupleBuilder(), r = (await t.get("latestCandlestick", e.build())).stack.readTupleOpt();
    return r ? ot(r) : null;
  }
  async getBalance(t) {
    let e = new TupleBuilder();
    return (await t.get("balance", e.build())).stack.readBigNumber();
  }
  async getDeployerAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("deployerAddress", e.build())).stack.readAddress();
  }
  async getStreamAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("streamAddress", e.build())).stack.readAddressOpt();
  }
  async getNotificationsCount(t) {
    let e = new TupleBuilder();
    return (await t.get("notificationsCount", e.build())).stack.readBigNumberOpt();
  }
  async getExpiration(t) {
    let e = new TupleBuilder();
    return (await t.get("expiration", e.build())).stack.readBigNumberOpt();
  }
  async getSessionAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("sessionAddress", e.build())).stack.readAddressOpt();
  }
};
function mt(i9) {
  return (t) => {
    let e = t;
    e.storeRef(i9.code), e.storeRef(i9.data);
  };
}
function te(i9) {
  return (t) => {
    let e = t;
    e.storeUint(306133030, 32), e.storeUint(i9.queryId, 64);
  };
}
function re(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3012477066, 32), e.storeUint(i9.queryId, 64);
  };
}
function ie(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1658160529, 32), e.storeUint(i9.queryId, 64);
  };
}
function Dt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3216336466, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.subscriber), e.storeInt(i9.notificationsCount, 257);
  };
}
function Ct(i9) {
  return (t) => {
    let e = t;
    e.storeInt(i9.start, 257), e.storeInt(i9.end, 257), e.storeInt(i9.open, 257);
    let n = new Builder();
    n.storeInt(i9.close, 257), n.storeInt(i9.high, 257), n.storeInt(i9.low, 257), e.storeRef(n.endCell());
  };
}
function ne(i9) {
  return (t) => {
    let e = t;
    e.storeUint(990592317, 32), e.storeUint(i9.queryId, 64), e.store(Ct(i9.candlestick));
  };
}
function wt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1031311118, 32), e.storeUint(i9.queryId, 64), e.storeInt(i9.batchId, 257);
  };
}
function ht(i9) {
  return (t) => {
    let e = t;
    e.storeUint(4082513223, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.session), e.storeInt(i9.remainingNotificationsCount, 257);
  };
}
function Tt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1003141156, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.session), e.storeInt(i9.remainingNotificationsCount, 257);
  };
}
function Nt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(269942218, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.subscriber);
  };
}
function qt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1533823831, 32), e.storeUint(i9.queryId, 64), e.storeInt(i9.notificationsCount, 257);
  };
}
function Et(i9) {
  return (t) => {
    let e = t;
    e.storeUint(495971614, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.subscriber), e.storeAddress(i9.batch), e.storeInt(i9.notificationsCount, 257);
  };
}
function Rt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(2668625285, 32), e.storeUint(i9.queryId, 64);
  };
}
function _t(i9) {
  return (t) => {
    let e = t;
    e.storeUint(2226780297, 32), e.storeUint(i9.queryId, 64);
  };
}
function kt(i9) {
  return (t) => {
    t.storeInt(i9.subscriptionsCount, 257);
  };
}
function Ut(i9) {
  return { $$type: "SBInfo", subscriptionsCount: i9.loadIntBig(257) };
}
function $t() {
  return { serialize: (i9, t) => {
    t.storeRef(beginCell$1().store(kt(i9)).endCell());
  }, parse: (i9) => Ut(i9.loadRef().beginParse()) };
}
function Pt(i9) {
  return (t) => {
    let e = t;
    e.storeAddress(i9.publisher), e.storeStringRefTail(i9.topic);
  };
}
async function ee(i9, t) {
  let e = Cell.fromBase64("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"), n = Cell.fromBase64("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"), r = beginCell$1();
  r.storeRef(n), r.storeUint(0, 1), Pt({ $$type: "DataStream_init_args", publisher: i9, topic: t })(r);
  let o = r.endCell();
  return { code: e, data: o };
}
var xt = { 2: { message: "Stack underflow" }, 3: { message: "Stack overflow" }, 4: { message: "Integer overflow" }, 5: { message: "Integer out of expected range" }, 6: { message: "Invalid opcode" }, 7: { message: "Type check error" }, 8: { message: "Cell overflow" }, 9: { message: "Cell underflow" }, 10: { message: "Dictionary error" }, 13: { message: "Out of gas error" }, 32: { message: "Method ID not found" }, 34: { message: "Action is invalid or not supported" }, 37: { message: "Not enough TON" }, 38: { message: "Not enough extra-currencies" }, 128: { message: "Null reference exception" }, 129: { message: "Invalid serialization prefix" }, 130: { message: "Invalid incoming message" }, 131: { message: "Constraints error" }, 132: { message: "Access denied" }, 133: { message: "Contract stopped" }, 134: { message: "Invalid argument" }, 135: { message: "Code of a contract was not found" }, 136: { message: "Invalid address" }, 137: { message: "Masterchain support is not enabled for this contract" } }, Qt = [{ name: "StateInit", header: null, fields: [{ name: "code", type: { kind: "simple", type: "cell", optional: false } }, { name: "data", type: { kind: "simple", type: "cell", optional: false } }] }, { name: "Context", header: null, fields: [{ name: "bounced", type: { kind: "simple", type: "bool", optional: false } }, { name: "sender", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "raw", type: { kind: "simple", type: "slice", optional: false } }] }, { name: "SendParameters", header: null, fields: [{ name: "bounce", type: { kind: "simple", type: "bool", optional: false } }, { name: "to", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "mode", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "body", type: { kind: "simple", type: "cell", optional: true } }, { name: "code", type: { kind: "simple", type: "cell", optional: true } }, { name: "data", type: { kind: "simple", type: "cell", optional: true } }] }, { name: "DSTDeploy", header: 306133030, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySuccess", header: 3957924127, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatch", header: 3012477066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatchSuccess", header: 1261138638, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTDeploySession", header: 1658160529, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySessionSuccess", header: 3452518278, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTSubscribe", header: 3216336466, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTSubscribeSuccess", header: 3770107736, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "Candlestick", header: null, fields: [{ name: "start", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "end", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "open", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "close", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "high", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "low", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTPublishCandlestick", header: 990592317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }] }, { name: "DSTPublishCandlestickSuccess", header: 215123525, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTUnsubscribedNotification", header: 1287102660, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBDeploy", header: 4267613765, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBDeploySuccess", header: 1031311118, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batchId", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribe", header: 2001551522, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribeSuccess", header: 4082513223, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestick", header: 4051052066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "publisher", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SBCandlestickPublishedNotification", header: 4175431181, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBUnsubscribedNotification", header: 1003141156, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestickSuccess", header: 1027631690, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploy", header: 1372687436, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploySuccess", header: 269942218, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SESSubscribe", header: 1533823831, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTTopUpSubscription", header: 495971614, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBTopUpSubscription", header: 267884312, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESSubscribeSuccess", header: 1400038355, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESCandlestickPublishedNotification", header: 3200926804, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribedNotification", header: 4092566650, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribe", header: 2668625285, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBUnsubscribe", header: 1095850324, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroy", header: 2226780297, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroySuccess", header: 21916563, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploy", header: 4195386677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploySuccess", header: 3142995347, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeployBroker", header: 298971134, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeploy", header: 1366331229, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDeploySuccess", header: 2536416450, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployBrokerSuccess", header: 4042145317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "broker", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccount", header: 3233956202, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploy", header: 1181556865, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploySuccess", header: 3517832790, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "trader", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccountSuccess", header: 1962963078, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "account", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeposit", header: 2141827764, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDepositSuccess", header: 2064422216, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdraw", header: 550691255, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdrawSuccess", header: 2654800410, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriptionInfo", header: null, fields: [{ name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBInfo", header: null, fields: [{ name: "subscriptionsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }], vt = [{ name: "balance", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "storageReserve", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "deployBatchDeposit", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "deploySessionDeposit", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "publishCandlestickDeposit", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "notificationDeposit", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "notificationPremium", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "publisherAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "topic", arguments: [], returnType: { kind: "simple", type: "string", optional: false } }, { name: "batches", arguments: [], returnType: { kind: "dict", key: "address", value: "SBInfo", valueFormat: "ref" } }, { name: "nextBatchId", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "batchAddress", arguments: [{ name: "batchId", type: { kind: "simple", type: "int", optional: false, format: 257 } }], returnType: { kind: "simple", type: "address", optional: false } }, { name: "sessionAddress", arguments: [{ name: "subscriber", type: { kind: "simple", type: "address", optional: false } }], returnType: { kind: "simple", type: "address", optional: false } }], Gt = [{ receiver: "internal", message: { kind: "typed", type: "DSTDeploy" } }, { receiver: "internal", message: { kind: "typed", type: "DSTDeployBatch" } }, { receiver: "internal", message: { kind: "typed", type: "SBDeploySuccess" } }, { receiver: "internal", message: { kind: "typed", type: "DSTDeploySession" } }, { receiver: "internal", message: { kind: "typed", type: "SESDeploySuccess" } }, { receiver: "internal", message: { kind: "typed", type: "DSTSubscribe" } }, { receiver: "internal", message: { kind: "typed", type: "DSTTopUpSubscription" } }, { receiver: "internal", message: { kind: "typed", type: "SBSubscribeSuccess" } }, { receiver: "internal", message: { kind: "typed", type: "DSTPublishCandlestick" } }, { receiver: "internal", message: { kind: "typed", type: "SBUnsubscribedNotification" } }], x = class i5 {
  constructor(t, e) {
    this.abi = { types: Qt, getters: vt, receivers: Gt, errors: xt };
    this.address = t, this.init = e;
  }
  static async init(t, e) {
    return await ee(t, e);
  }
  static async fromInit(t, e) {
    let n = await ee(t, e), r = contractAddress(0, n);
    return new i5(r, n);
  }
  static fromAddress(t) {
    return new i5(t);
  }
  async send(t, e, n, r) {
    let o = null;
    if (r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTDeploy" && (o = beginCell$1().store(te(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTDeployBatch" && (o = beginCell$1().store(re(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SBDeploySuccess" && (o = beginCell$1().store(wt(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTDeploySession" && (o = beginCell$1().store(ie(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESDeploySuccess" && (o = beginCell$1().store(Nt(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTSubscribe" && (o = beginCell$1().store(Dt(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTTopUpSubscription" && (o = beginCell$1().store(Et(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SBSubscribeSuccess" && (o = beginCell$1().store(ht(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTPublishCandlestick" && (o = beginCell$1().store(ne(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SBUnsubscribedNotification" && (o = beginCell$1().store(Tt(r)).endCell()), o === null) throw new Error("Invalid message type");
    await t.internal(e, { ...n, body: o });
  }
  async getBalance(t) {
    let e = new TupleBuilder();
    return (await t.get("balance", e.build())).stack.readBigNumber();
  }
  async getStorageReserve(t) {
    let e = new TupleBuilder();
    return (await t.get("storageReserve", e.build())).stack.readBigNumber();
  }
  async getDeployBatchDeposit(t) {
    let e = new TupleBuilder();
    return (await t.get("deployBatchDeposit", e.build())).stack.readBigNumber();
  }
  async getDeploySessionDeposit(t) {
    let e = new TupleBuilder();
    return (await t.get("deploySessionDeposit", e.build())).stack.readBigNumber();
  }
  async getPublishCandlestickDeposit(t) {
    let e = new TupleBuilder();
    return (await t.get("publishCandlestickDeposit", e.build())).stack.readBigNumber();
  }
  async getNotificationDeposit(t) {
    let e = new TupleBuilder();
    return (await t.get("notificationDeposit", e.build())).stack.readBigNumber();
  }
  async getNotificationPremium(t) {
    let e = new TupleBuilder();
    return (await t.get("notificationPremium", e.build())).stack.readBigNumber();
  }
  async getPublisherAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("publisherAddress", e.build())).stack.readAddress();
  }
  async getTopic(t) {
    let e = new TupleBuilder();
    return (await t.get("topic", e.build())).stack.readString();
  }
  async getBatches(t) {
    let e = new TupleBuilder(), n = (await t.get("batches", e.build())).stack;
    return Dictionary.loadDirect(Dictionary.Keys.Address(), $t(), n.readCellOpt());
  }
  async getNextBatchId(t) {
    let e = new TupleBuilder();
    return (await t.get("nextBatchId", e.build())).stack.readBigNumber();
  }
  async getBatchAddress(t, e) {
    let n = new TupleBuilder();
    return n.writeNumber(e), (await t.get("batchAddress", n.build())).stack.readAddress();
  }
  async getSessionAddress(t, e) {
    let n = new TupleBuilder();
    return n.writeAddress(e), (await t.get("sessionAddress", n.build())).stack.readAddress();
  }
};
function Lt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3770107736, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.batch), e.storeInt(i9.remainingNotificationsCount, 257);
  };
}
function Vt(i9) {
  return (t) => {
    let e = t;
    e.storeInt(i9.start, 257), e.storeInt(i9.end, 257), e.storeInt(i9.open, 257);
    let n = new Builder();
    n.storeInt(i9.close, 257), n.storeInt(i9.high, 257), n.storeInt(i9.low, 257), e.storeRef(n.endCell());
  };
}
function Ot(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1287102660, 32), e.storeUint(i9.queryId, 64), e.storeInt(i9.remainingNotificationsCount, 257);
  };
}
function zt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(4175431181, 32), e.storeUint(i9.queryId, 64), e.store(Vt(i9.candlestick));
    let n = new Builder();
    n.storeInt(i9.remainingNotificationsCount, 257), e.storeRef(n.endCell());
  };
}
function Ht(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1372687436, 32), e.storeUint(i9.queryId, 64);
  };
}
function Kt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1533823831, 32), e.storeUint(i9.queryId, 64), e.storeInt(i9.notificationsCount, 257);
  };
}
function Jt(i9) {
  return (t) => {
    let e = t;
    e.storeUint(2668625285, 32), e.storeUint(i9.queryId, 64);
  };
}
function Ft(i9) {
  return (t) => {
    let e = t;
    e.storeUint(2226780297, 32), e.storeUint(i9.queryId, 64);
  };
}
function Yt(i9) {
  return (t) => {
    let e = t;
    e.storeAddress(i9.stream), e.storeAddress(i9.subscriber);
  };
}
async function se(i9, t) {
  let e = Cell.fromBase64("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"), n = Cell.fromBase64("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"), r = beginCell$1();
  r.storeRef(n), r.storeUint(0, 1), Yt({ $$type: "Session_init_args", stream: i9, subscriber: t })(r);
  let o = r.endCell();
  return { code: e, data: o };
}
var Wt = { 2: { message: "Stack underflow" }, 3: { message: "Stack overflow" }, 4: { message: "Integer overflow" }, 5: { message: "Integer out of expected range" }, 6: { message: "Invalid opcode" }, 7: { message: "Type check error" }, 8: { message: "Cell overflow" }, 9: { message: "Cell underflow" }, 10: { message: "Dictionary error" }, 13: { message: "Out of gas error" }, 32: { message: "Method ID not found" }, 34: { message: "Action is invalid or not supported" }, 37: { message: "Not enough TON" }, 38: { message: "Not enough extra-currencies" }, 128: { message: "Null reference exception" }, 129: { message: "Invalid serialization prefix" }, 130: { message: "Invalid incoming message" }, 131: { message: "Constraints error" }, 132: { message: "Access denied" }, 133: { message: "Contract stopped" }, 134: { message: "Invalid argument" }, 135: { message: "Code of a contract was not found" }, 136: { message: "Invalid address" }, 137: { message: "Masterchain support is not enabled for this contract" } }, Xt = [{ name: "StateInit", header: null, fields: [{ name: "code", type: { kind: "simple", type: "cell", optional: false } }, { name: "data", type: { kind: "simple", type: "cell", optional: false } }] }, { name: "Context", header: null, fields: [{ name: "bounced", type: { kind: "simple", type: "bool", optional: false } }, { name: "sender", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "raw", type: { kind: "simple", type: "slice", optional: false } }] }, { name: "SendParameters", header: null, fields: [{ name: "bounce", type: { kind: "simple", type: "bool", optional: false } }, { name: "to", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "mode", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "body", type: { kind: "simple", type: "cell", optional: true } }, { name: "code", type: { kind: "simple", type: "cell", optional: true } }, { name: "data", type: { kind: "simple", type: "cell", optional: true } }] }, { name: "DSTDeploy", header: 306133030, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySuccess", header: 3957924127, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatch", header: 3012477066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatchSuccess", header: 1261138638, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTDeploySession", header: 1658160529, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySessionSuccess", header: 3452518278, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTSubscribe", header: 3216336466, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTSubscribeSuccess", header: 3770107736, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "Candlestick", header: null, fields: [{ name: "start", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "end", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "open", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "close", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "high", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "low", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTPublishCandlestick", header: 990592317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }] }, { name: "DSTPublishCandlestickSuccess", header: 215123525, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTUnsubscribedNotification", header: 1287102660, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBDeploy", header: 4267613765, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBDeploySuccess", header: 1031311118, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batchId", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribe", header: 2001551522, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribeSuccess", header: 4082513223, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestick", header: 4051052066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "publisher", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SBCandlestickPublishedNotification", header: 4175431181, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBUnsubscribedNotification", header: 1003141156, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestickSuccess", header: 1027631690, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploy", header: 1372687436, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploySuccess", header: 269942218, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SESSubscribe", header: 1533823831, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTTopUpSubscription", header: 495971614, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBTopUpSubscription", header: 267884312, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESSubscribeSuccess", header: 1400038355, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESCandlestickPublishedNotification", header: 3200926804, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribedNotification", header: 4092566650, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribe", header: 2668625285, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBUnsubscribe", header: 1095850324, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroy", header: 2226780297, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroySuccess", header: 21916563, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploy", header: 4195386677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploySuccess", header: 3142995347, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeployBroker", header: 298971134, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeploy", header: 1366331229, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDeploySuccess", header: 2536416450, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployBrokerSuccess", header: 4042145317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "broker", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccount", header: 3233956202, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploy", header: 1181556865, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploySuccess", header: 3517832790, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "trader", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccountSuccess", header: 1962963078, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "account", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeposit", header: 2141827764, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDepositSuccess", header: 2064422216, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdraw", header: 550691255, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdrawSuccess", header: 2654800410, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriptionInfo", header: null, fields: [{ name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBInfo", header: null, fields: [{ name: "subscriptionsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }], jt = [{ name: "balance", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "storageReserve", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "subscribeDeposit", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "unsubscribeDeposit", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "destroyDeposit", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "streamAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "subscriberAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "batchAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: true } }], Zt = [{ receiver: "internal", message: { kind: "typed", type: "SESDeploy" } }, { receiver: "internal", message: { kind: "typed", type: "SESSubscribe" } }, { receiver: "internal", message: { kind: "typed", type: "DSTSubscribeSuccess" } }, { receiver: "internal", message: { kind: "typed", type: "SBCandlestickPublishedNotification" } }, { receiver: "internal", message: { kind: "typed", type: "DSTUnsubscribedNotification" } }, { receiver: "internal", message: { kind: "typed", type: "SESUnsubscribe" } }, { receiver: "internal", message: { kind: "typed", type: "SESDestroy" } }], Q = class i6 {
  constructor(t, e) {
    this.abi = { types: Xt, getters: jt, receivers: Zt, errors: Wt };
    this.address = t, this.init = e;
  }
  static async init(t, e) {
    return await se(t, e);
  }
  static async fromInit(t, e) {
    let n = await se(t, e), r = contractAddress(0, n);
    return new i6(r, n);
  }
  static fromAddress(t) {
    return new i6(t);
  }
  async send(t, e, n, r) {
    let o = null;
    if (r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESDeploy" && (o = beginCell$1().store(Ht(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESSubscribe" && (o = beginCell$1().store(Kt(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTSubscribeSuccess" && (o = beginCell$1().store(Lt(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SBCandlestickPublishedNotification" && (o = beginCell$1().store(zt(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTUnsubscribedNotification" && (o = beginCell$1().store(Ot(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESUnsubscribe" && (o = beginCell$1().store(Jt(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESDestroy" && (o = beginCell$1().store(Ft(r)).endCell()), o === null) throw new Error("Invalid message type");
    await t.internal(e, { ...n, body: o });
  }
  async getBalance(t) {
    let e = new TupleBuilder();
    return (await t.get("balance", e.build())).stack.readBigNumber();
  }
  async getStorageReserve(t) {
    let e = new TupleBuilder();
    return (await t.get("storageReserve", e.build())).stack.readBigNumber();
  }
  async getSubscribeDeposit(t) {
    let e = new TupleBuilder();
    return (await t.get("subscribeDeposit", e.build())).stack.readBigNumber();
  }
  async getUnsubscribeDeposit(t) {
    let e = new TupleBuilder();
    return (await t.get("unsubscribeDeposit", e.build())).stack.readBigNumber();
  }
  async getDestroyDeposit(t) {
    let e = new TupleBuilder();
    return (await t.get("destroyDeposit", e.build())).stack.readBigNumber();
  }
  async getStreamAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("streamAddress", e.build())).stack.readAddress();
  }
  async getSubscriberAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("subscriberAddress", e.build())).stack.readAddress();
  }
  async getBatchAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("batchAddress", e.build())).stack.readAddressOpt();
  }
};
function tr(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3452518278, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.session);
  };
}
function rr(i9) {
  return (t) => {
    let e = t;
    e.storeInt(i9.start, 257), e.storeInt(i9.end, 257), e.storeInt(i9.open, 257);
    let n = new Builder();
    n.storeInt(i9.close, 257), n.storeInt(i9.high, 257), n.storeInt(i9.low, 257), e.storeRef(n.endCell());
  };
}
function ir(i9) {
  let t = i9.readBigNumber(), e = i9.readBigNumber(), n = i9.readBigNumber(), r = i9.readBigNumber(), o = i9.readBigNumber(), B = i9.readBigNumber();
  return { $$type: "Candlestick", start: t, end: e, open: n, close: r, high: o, low: B };
}
function nr(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1400038355, 32), e.storeUint(i9.queryId, 64), e.storeInt(i9.remainingNotificationsCount, 257);
  };
}
function or(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3200926804, 32), e.storeUint(i9.queryId, 64), e.store(rr(i9.candlestick));
    let n = new Builder();
    n.storeInt(i9.remainingNotificationsCount, 257), e.storeRef(n.endCell());
  };
}
function sr(i9) {
  return (t) => {
    let e = t;
    e.storeUint(4092566650, 32), e.storeUint(i9.queryId, 64), e.storeInt(i9.remainingNotificationsCount, 257);
  };
}
function lr(i9) {
  return (t) => {
    let e = t;
    e.storeUint(21916563, 32), e.storeUint(i9.queryId, 64);
  };
}
function ce(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1397988627, 32), e.storeUint(i9.queryId, 64);
  };
}
function pe(i9) {
  return (t) => {
    let e = t;
    e.storeUint(3073362313, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.stream), e.storeInt(i9.notificationsCount, 257), e.storeInt(i9.expiration, 257);
  };
}
function ur(i9) {
  return (t) => {
    let e = t;
    e.storeAddress(i9.deployer), e.storeInt(i9.subscriberId, 257);
  };
}
async function ae(i9, t) {
  let e = Cell.fromBase64("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"), n = Cell.fromBase64("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"), r = beginCell$1();
  r.storeRef(n), r.storeUint(0, 1), ur({ $$type: "SimpleSubscriber_init_args", deployer: i9, subscriberId: t })(r);
  let o = r.endCell();
  return { code: e, data: o };
}
var ar = { 2: { message: "Stack underflow" }, 3: { message: "Stack overflow" }, 4: { message: "Integer overflow" }, 5: { message: "Integer out of expected range" }, 6: { message: "Invalid opcode" }, 7: { message: "Type check error" }, 8: { message: "Cell overflow" }, 9: { message: "Cell underflow" }, 10: { message: "Dictionary error" }, 13: { message: "Out of gas error" }, 32: { message: "Method ID not found" }, 34: { message: "Action is invalid or not supported" }, 37: { message: "Not enough TON" }, 38: { message: "Not enough extra-currencies" }, 128: { message: "Null reference exception" }, 129: { message: "Invalid serialization prefix" }, 130: { message: "Invalid incoming message" }, 131: { message: "Constraints error" }, 132: { message: "Access denied" }, 133: { message: "Contract stopped" }, 134: { message: "Invalid argument" }, 135: { message: "Code of a contract was not found" }, 136: { message: "Invalid address" }, 137: { message: "Masterchain support is not enabled for this contract" } }, dr = [{ name: "StateInit", header: null, fields: [{ name: "code", type: { kind: "simple", type: "cell", optional: false } }, { name: "data", type: { kind: "simple", type: "cell", optional: false } }] }, { name: "Context", header: null, fields: [{ name: "bounced", type: { kind: "simple", type: "bool", optional: false } }, { name: "sender", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "raw", type: { kind: "simple", type: "slice", optional: false } }] }, { name: "SendParameters", header: null, fields: [{ name: "bounce", type: { kind: "simple", type: "bool", optional: false } }, { name: "to", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "mode", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "body", type: { kind: "simple", type: "cell", optional: true } }, { name: "code", type: { kind: "simple", type: "cell", optional: true } }, { name: "data", type: { kind: "simple", type: "cell", optional: true } }] }, { name: "DSTDeploy", header: 306133030, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySuccess", header: 3957924127, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatch", header: 3012477066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatchSuccess", header: 1261138638, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTDeploySession", header: 1658160529, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySessionSuccess", header: 3452518278, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTSubscribe", header: 3216336466, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTSubscribeSuccess", header: 3770107736, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "Candlestick", header: null, fields: [{ name: "start", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "end", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "open", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "close", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "high", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "low", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTPublishCandlestick", header: 990592317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }] }, { name: "DSTPublishCandlestickSuccess", header: 215123525, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTUnsubscribedNotification", header: 1287102660, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBDeploy", header: 4267613765, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBDeploySuccess", header: 1031311118, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batchId", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribe", header: 2001551522, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribeSuccess", header: 4082513223, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestick", header: 4051052066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "publisher", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SBCandlestickPublishedNotification", header: 4175431181, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBUnsubscribedNotification", header: 1003141156, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestickSuccess", header: 1027631690, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploy", header: 1372687436, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploySuccess", header: 269942218, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SESSubscribe", header: 1533823831, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTTopUpSubscription", header: 495971614, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBTopUpSubscription", header: 267884312, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESSubscribeSuccess", header: 1400038355, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESCandlestickPublishedNotification", header: 3200926804, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribedNotification", header: 4092566650, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribe", header: 2668625285, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBUnsubscribe", header: 1095850324, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroy", header: 2226780297, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroySuccess", header: 21916563, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploy", header: 4195386677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploySuccess", header: 3142995347, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeployBroker", header: 298971134, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeploy", header: 1366331229, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDeploySuccess", header: 2536416450, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployBrokerSuccess", header: 4042145317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "broker", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccount", header: 3233956202, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploy", header: 1181556865, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploySuccess", header: 3517832790, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "trader", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccountSuccess", header: 1962963078, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "account", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeposit", header: 2141827764, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDepositSuccess", header: 2064422216, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdraw", header: 550691255, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdrawSuccess", header: 2654800410, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberDestroyedNotification", header: 2253786793, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberCheckTimeout", header: 1397988627, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriberTimeoutExceeded", header: 2857706980, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SimpleSubscriberDeploy", header: 3073362313, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "expiration", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SimpleSubscriberDeploySuccess", header: 4287938591, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriberId", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }], cr = [{ name: "latestCandlestick", arguments: [], returnType: { kind: "simple", type: "Candlestick", optional: true } }, { name: "balance", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "deployerAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "streamAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: true } }, { name: "notificationsCount", arguments: [], returnType: { kind: "simple", type: "int", optional: true, format: 257 } }, { name: "expiration", arguments: [], returnType: { kind: "simple", type: "int", optional: true, format: 257 } }, { name: "sessionAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: true } }], pr = [{ receiver: "internal", message: { kind: "typed", type: "SimpleSubscriberDeploy" } }, { receiver: "internal", message: { kind: "typed", type: "DSTDeploySessionSuccess" } }, { receiver: "internal", message: { kind: "typed", type: "SESSubscribeSuccess" } }, { receiver: "internal", message: { kind: "typed", type: "SESCandlestickPublishedNotification" } }, { receiver: "internal", message: { kind: "typed", type: "SESUnsubscribedNotification" } }, { receiver: "internal", message: { kind: "typed", type: "SESDestroySuccess" } }, { receiver: "internal", message: { kind: "typed", type: "SubscriberCheckTimeout" } }], v = class i7 {
  constructor(t, e) {
    this.abi = { types: dr, getters: cr, receivers: pr, errors: ar };
    this.address = t, this.init = e;
  }
  static async init(t, e) {
    return await ae(t, e);
  }
  static async fromInit(t, e) {
    let n = await ae(t, e), r = contractAddress(0, n);
    return new i7(r, n);
  }
  static fromAddress(t) {
    return new i7(t);
  }
  async send(t, e, n, r) {
    let o = null;
    if (r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SimpleSubscriberDeploy" && (o = beginCell$1().store(pe(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "DSTDeploySessionSuccess" && (o = beginCell$1().store(tr(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESSubscribeSuccess" && (o = beginCell$1().store(nr(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESCandlestickPublishedNotification" && (o = beginCell$1().store(or(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESUnsubscribedNotification" && (o = beginCell$1().store(sr(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SESDestroySuccess" && (o = beginCell$1().store(lr(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SubscriberCheckTimeout" && (o = beginCell$1().store(ce(r)).endCell()), o === null) throw new Error("Invalid message type");
    await t.internal(e, { ...n, body: o });
  }
  async getLatestCandlestick(t) {
    let e = new TupleBuilder(), r = (await t.get("latestCandlestick", e.build())).stack.readTupleOpt();
    return r ? ir(r) : null;
  }
  async getBalance(t) {
    let e = new TupleBuilder();
    return (await t.get("balance", e.build())).stack.readBigNumber();
  }
  async getDeployerAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("deployerAddress", e.build())).stack.readAddress();
  }
  async getStreamAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("streamAddress", e.build())).stack.readAddressOpt();
  }
  async getNotificationsCount(t) {
    let e = new TupleBuilder();
    return (await t.get("notificationsCount", e.build())).stack.readBigNumberOpt();
  }
  async getExpiration(t) {
    let e = new TupleBuilder();
    return (await t.get("expiration", e.build())).stack.readBigNumberOpt();
  }
  async getSessionAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("sessionAddress", e.build())).stack.readAddressOpt();
  }
};
function br(i9) {
  return (t) => {
    let e = t;
    e.storeInt(i9.start, 257), e.storeInt(i9.end, 257), e.storeInt(i9.open, 257);
    let n = new Builder();
    n.storeInt(i9.close, 257), n.storeInt(i9.high, 257), n.storeInt(i9.low, 257), e.storeRef(n.endCell());
  };
}
function Sr(i9) {
  return (t) => {
    let e = t;
    e.storeUint(4267613765, 32), e.storeUint(i9.queryId, 64);
  };
}
function fr(i9) {
  return (t) => {
    let e = t;
    e.storeUint(2001551522, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.session), e.storeInt(i9.notificationsCount, 257);
  };
}
function Br(i9) {
  return (t) => {
    let e = t;
    e.storeUint(4051052066, 32), e.storeUint(i9.queryId, 64), e.store(br(i9.candlestick));
    let n = new Builder();
    n.storeAddress(i9.publisher), e.storeRef(n.endCell());
  };
}
function Ir(i9) {
  return (t) => {
    let e = t;
    e.storeUint(267884312, 32), e.storeUint(i9.queryId, 64), e.storeAddress(i9.session), e.storeInt(i9.notificationsCount, 257);
  };
}
function gr(i9) {
  return (t) => {
    let e = t;
    e.storeUint(1095850324, 32), e.storeUint(i9.queryId, 64);
  };
}
function mr(i9) {
  return (t) => {
    t.storeInt(i9.remainingNotificationsCount, 257);
  };
}
function Ar(i9) {
  return { $$type: "SubscriptionInfo", remainingNotificationsCount: i9.loadIntBig(257) };
}
function Dr() {
  return { serialize: (i9, t) => {
    t.storeRef(beginCell$1().store(mr(i9)).endCell());
  }, parse: (i9) => Ar(i9.loadRef().beginParse()) };
}
function Cr(i9) {
  return (t) => {
    let e = t;
    e.storeAddress(i9.stream), e.storeInt(i9.batchId, 257);
  };
}
async function Se(i9, t) {
  let e = Cell.fromBase64("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"), n = Cell.fromBase64("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"), r = beginCell$1();
  r.storeRef(n), r.storeUint(0, 1), Cr({ $$type: "SubscriptionBatch_init_args", stream: i9, batchId: t })(r);
  let o = r.endCell();
  return { code: e, data: o };
}
var wr = { 2: { message: "Stack underflow" }, 3: { message: "Stack overflow" }, 4: { message: "Integer overflow" }, 5: { message: "Integer out of expected range" }, 6: { message: "Invalid opcode" }, 7: { message: "Type check error" }, 8: { message: "Cell overflow" }, 9: { message: "Cell underflow" }, 10: { message: "Dictionary error" }, 13: { message: "Out of gas error" }, 32: { message: "Method ID not found" }, 34: { message: "Action is invalid or not supported" }, 37: { message: "Not enough TON" }, 38: { message: "Not enough extra-currencies" }, 128: { message: "Null reference exception" }, 129: { message: "Invalid serialization prefix" }, 130: { message: "Invalid incoming message" }, 131: { message: "Constraints error" }, 132: { message: "Access denied" }, 133: { message: "Contract stopped" }, 134: { message: "Invalid argument" }, 135: { message: "Code of a contract was not found" }, 136: { message: "Invalid address" }, 137: { message: "Masterchain support is not enabled for this contract" } }, hr = [{ name: "StateInit", header: null, fields: [{ name: "code", type: { kind: "simple", type: "cell", optional: false } }, { name: "data", type: { kind: "simple", type: "cell", optional: false } }] }, { name: "Context", header: null, fields: [{ name: "bounced", type: { kind: "simple", type: "bool", optional: false } }, { name: "sender", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "raw", type: { kind: "simple", type: "slice", optional: false } }] }, { name: "SendParameters", header: null, fields: [{ name: "bounce", type: { kind: "simple", type: "bool", optional: false } }, { name: "to", type: { kind: "simple", type: "address", optional: false } }, { name: "value", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "mode", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "body", type: { kind: "simple", type: "cell", optional: true } }, { name: "code", type: { kind: "simple", type: "cell", optional: true } }, { name: "data", type: { kind: "simple", type: "cell", optional: true } }] }, { name: "DSTDeploy", header: 306133030, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySuccess", header: 3957924127, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatch", header: 3012477066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeployBatchSuccess", header: 1261138638, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTDeploySession", header: 1658160529, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTDeploySessionSuccess", header: 3452518278, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }] }, { name: "DSTSubscribe", header: 3216336466, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTSubscribeSuccess", header: 3770107736, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "Candlestick", header: null, fields: [{ name: "start", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "end", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "open", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "close", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "high", type: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "low", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTPublishCandlestick", header: 990592317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }] }, { name: "DSTPublishCandlestickSuccess", header: 215123525, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "DSTUnsubscribedNotification", header: 1287102660, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBDeploy", header: 4267613765, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBDeploySuccess", header: 1031311118, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "batchId", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribe", header: 2001551522, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBSubscribeSuccess", header: 4082513223, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestick", header: 4051052066, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "publisher", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SBCandlestickPublishedNotification", header: 4175431181, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBUnsubscribedNotification", header: 1003141156, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBPublishCandlestickSuccess", header: 1027631690, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploy", header: 1372687436, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDeploySuccess", header: 269942218, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }] }, { name: "SESSubscribe", header: 1533823831, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "DSTTopUpSubscription", header: 495971614, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "subscriber", type: { kind: "simple", type: "address", optional: false } }, { name: "batch", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBTopUpSubscription", header: 267884312, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "session", type: { kind: "simple", type: "address", optional: false } }, { name: "notificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESSubscribeSuccess", header: 1400038355, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESCandlestickPublishedNotification", header: 3200926804, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "candlestick", type: { kind: "simple", type: "Candlestick", optional: false } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribedNotification", header: 4092566650, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SESUnsubscribe", header: 2668625285, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SBUnsubscribe", header: 1095850324, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroy", header: 2226780297, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SESDestroySuccess", header: 21916563, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploy", header: 4195386677, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeploySuccess", header: 3142995347, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRGDeployBroker", header: 298971134, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeploy", header: 1366331229, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDeploySuccess", header: 2536416450, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "stream", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployBrokerSuccess", header: 4042145317, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "broker", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccount", header: 3233956202, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploy", header: 1181556865, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRADeploySuccess", header: 3517832790, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "trader", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRGDeployAccountSuccess", header: 1962963078, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }, { name: "account", type: { kind: "simple", type: "address", optional: false } }] }, { name: "BRKDeposit", header: 2141827764, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKDepositSuccess", header: 2064422216, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdraw", header: 550691255, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "BRKWithdrawSuccess", header: 2654800410, fields: [{ name: "queryId", type: { kind: "simple", type: "uint", optional: false, format: 64 } }] }, { name: "SubscriptionInfo", header: null, fields: [{ name: "remainingNotificationsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }, { name: "SBInfo", header: null, fields: [{ name: "subscriptionsCount", type: { kind: "simple", type: "int", optional: false, format: 257 } }] }], Tr = [{ name: "balance", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "storageReserve", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "streamAddress", arguments: [], returnType: { kind: "simple", type: "address", optional: false } }, { name: "batchId", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }, { name: "subscriptions", arguments: [], returnType: { kind: "dict", key: "address", value: "SubscriptionInfo", valueFormat: "ref" } }, { name: "subscriptionsCount", arguments: [], returnType: { kind: "simple", type: "int", optional: false, format: 257 } }], Nr = [{ receiver: "internal", message: { kind: "typed", type: "SBDeploy" } }, { receiver: "internal", message: { kind: "typed", type: "SBSubscribe" } }, { receiver: "internal", message: { kind: "typed", type: "SBTopUpSubscription" } }, { receiver: "internal", message: { kind: "typed", type: "SBPublishCandlestick" } }, { receiver: "internal", message: { kind: "typed", type: "SBUnsubscribe" } }], G = class i8 {
  constructor(t, e) {
    this.abi = { types: hr, getters: Tr, receivers: Nr, errors: wr };
    this.address = t, this.init = e;
  }
  static async init(t, e) {
    return await Se(t, e);
  }
  static async fromInit(t, e) {
    let n = await Se(t, e), r = contractAddress(0, n);
    return new i8(r, n);
  }
  static fromAddress(t) {
    return new i8(t);
  }
  async send(t, e, n, r) {
    let o = null;
    if (r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SBDeploy" && (o = beginCell$1().store(Sr(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SBSubscribe" && (o = beginCell$1().store(fr(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SBTopUpSubscription" && (o = beginCell$1().store(Ir(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SBPublishCandlestick" && (o = beginCell$1().store(Br(r)).endCell()), r && typeof r == "object" && !(r instanceof Slice) && r.$$type === "SBUnsubscribe" && (o = beginCell$1().store(gr(r)).endCell()), o === null) throw new Error("Invalid message type");
    await t.internal(e, { ...n, body: o });
  }
  async getBalance(t) {
    let e = new TupleBuilder();
    return (await t.get("balance", e.build())).stack.readBigNumber();
  }
  async getStorageReserve(t) {
    let e = new TupleBuilder();
    return (await t.get("storageReserve", e.build())).stack.readBigNumber();
  }
  async getStreamAddress(t) {
    let e = new TupleBuilder();
    return (await t.get("streamAddress", e.build())).stack.readAddress();
  }
  async getBatchId(t) {
    let e = new TupleBuilder();
    return (await t.get("batchId", e.build())).stack.readBigNumber();
  }
  async getSubscriptions(t) {
    let e = new TupleBuilder(), n = (await t.get("subscriptions", e.build())).stack;
    return Dictionary.loadDirect(Dictionary.Keys.Address(), Dr(), n.readCellOpt());
  }
  async getSubscriptionsCount(t) {
    let e = new TupleBuilder();
    return (await t.get("subscriptionsCount", e.build())).stack.readBigNumber();
  }
};
var Bo = toNano("0.03"), Io = toNano("0.01");
toNano("1");
toNano("2");
class DataStreamWrapper {
  publicClient;
  tonConnectUI;
  streamAddress;
  constructor(publicClient2, tonConnectUI2, streamAddress) {
    this.publicClient = publicClient2;
    this.tonConnectUI = tonConnectUI2;
    if (streamAddress) {
      this.streamAddress = streamAddress;
      saveContractAddress(streamAddress, DATA_STREAM_STORAGE_KEY);
    }
  }
  getOpenedContract() {
    let contractAddress2 = this.streamAddress;
    if (!contractAddress2) {
      contractAddress2 = loadData(DATA_STREAM_STORAGE_KEY)?.address;
      if (!contractAddress2) {
        throw new Error("No stream address found. Did you deploy the data stream?");
      }
    }
    const contractAddressParsed = Address.parse(contractAddress2);
    return this.publicClient.open(x.fromAddress(contractAddressParsed));
  }
  async deploy(args) {
    const publisher = this.tonConnectUI.account?.address;
    if (!publisher) {
      throw new Error("No account connected. Did you connect to the wallet?");
    }
    const stream = this.publicClient.open(
      await x.fromInit(Address.parse(publisher), args.topic)
    );
    const message = {
      address: stream.address.toString(),
      amount: DST_DEPLOY_DEPOSIT.toString(),
      payload: beginCell().store(
        te({
          $$type: "DSTDeploy",
          queryId: args.queryId
        })
      ).endCell().toBoc().toString("base64"),
      stateInit: beginCell().store(
        mt({
          $$type: "StateInit",
          ...stream.init
        })
      ).endCell().toBoc().toString("base64")
    };
    await this.tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1e3) + 360,
      messages: [message],
      network: CHAIN.TESTNET
    });
    this.streamAddress = stream.address.toString();
    saveContractAddress(stream, DATA_STREAM_STORAGE_KEY);
    return this;
  }
  async deploySubscriptionBatch(args) {
    const stream = this.getOpenedContract();
    const message = {
      address: stream.address.toString(),
      amount: DST_DEPLOY_BATCH_DEPOSIT.toString(),
      payload: beginCell().store(
        re({
          $$type: "DSTDeployBatch",
          queryId: args.queryId
        })
      ).endCell().toBoc().toString("base64")
    };
    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });
    return this;
  }
  async deploySession(args) {
    const stream = this.getOpenedContract();
    const message = {
      address: stream.address.toString(),
      amount: DST_DEPLOY_SESSION_DEPOSIT.toString(),
      payload: beginCell().store(
        ie({
          $$type: "DSTDeploySession",
          queryId: args.queryId
        })
      ).endCell().toBoc().toString("base64")
    };
    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });
    return this;
  }
  async publishCandlestick(args) {
    const stream = this.getOpenedContract();
    const message = {
      address: stream.address.toString(),
      amount: DST_PUBLISH_CANDLESTICK_DEPOSIT.toString(),
      payload: beginCell().store(
        ne({
          $$type: "DSTPublishCandlestick",
          queryId: args.queryId,
          candlestick: {
            $$type: "Candlestick",
            ...args.candlestick
          }
        })
      ).endCell().toBoc().toString("base64")
    };
    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });
    return this;
  }
  async getBalance() {
    return await this.getOpenedContract().getBalance();
  }
  async getPublisherAddress() {
    return (await this.getOpenedContract().getPublisherAddress()).toString({
      testOnly: true,
      bounceable: false
    });
  }
  async getTopic() {
    return await this.getOpenedContract().getTopic();
  }
  async getBatches() {
    return await this.getOpenedContract().getBatches();
  }
  async getNextBatchId() {
    return await this.getOpenedContract().getNextBatchId();
  }
  async getBatchAddress(batchId) {
    return (await this.getOpenedContract().getBatchAddress(batchId)).toString({
      testOnly: true,
      bounceable: false
    });
  }
  async getSessionAddress(subscriberAddress) {
    return (await this.getOpenedContract().getSessionAddress(subscriberAddress)).toString({
      testOnly: true,
      bounceable: false
    });
  }
}
class SessionWrapper {
  publicClient;
  tonConnectUI;
  subscriberAddress;
  constructor(publicClient2, tonConnectUI2, subscriberAddress) {
    this.publicClient = publicClient2;
    this.tonConnectUI = tonConnectUI2;
    this.subscriberAddress = subscriberAddress;
  }
  async getOpenedContract() {
    const streamAddress = loadData(DATA_STREAM_STORAGE_KEY)?.address;
    if (!streamAddress) {
      throw new Error("No stream address found. Did you deploy the data stream?");
    }
    const sessionAddress = loadData(SESSION_STORAGE_KEY)?.address;
    let session;
    if (sessionAddress) {
      session = Q.fromAddress(Address.parse(sessionAddress));
    } else {
      session = await Q.fromInit(
        Address.parse(streamAddress),
        Address.parse(this.subscriberAddress)
      );
      saveContractAddress(session, SESSION_STORAGE_KEY);
    }
    return this.publicClient.open(session);
  }
  async subscribe(args) {
    const contract = await this.getOpenedContract();
    const message = {
      address: contract.address.toString(),
      amount: SES_SUBSCRIBE_DEPOSIT.toString(),
      payload: beginCell().store(
        qt({
          $$type: "SESSubscribe",
          notificationsCount: args.notificationsCount,
          queryId: args.queryId
        })
      ).endCell().toBoc().toString("base64")
    };
    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });
    return this;
  }
  async unsubscribe(args) {
    const contract = await this.getOpenedContract();
    const message = {
      address: contract.address.toString(),
      amount: SES_SUBSCRIBE_DEPOSIT.toString(),
      payload: beginCell().store(
        Rt({
          $$type: "SESUnsubscribe",
          queryId: args.queryId
        })
      ).endCell().toBoc().toString("base64")
    };
    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });
    return this;
  }
  async destroy(args) {
    const contract = await this.getOpenedContract();
    const message = {
      address: contract.address.toString(),
      amount: "0",
      payload: beginCell().store(
        _t({
          $$type: "SESDestroy",
          queryId: args.queryId
        })
      ).endCell().toBoc().toString("base64")
    };
    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });
    return this;
  }
  async getBalance() {
    return (await this.getOpenedContract()).getBalance();
  }
  async getStreamAddress() {
    return (await this.getOpenedContract()).getStreamAddress();
  }
  async getSubscriberAddress() {
    return (await this.getOpenedContract()).getSubscriberAddress();
  }
  async getBatchAddress() {
    return (await this.getOpenedContract()).getBatchAddress();
  }
}
class SimpleSubscriberWrapper {
  publicClient;
  tonConnectUI;
  simpleSubscriberAddress;
  constructor(publicClient2, tonConnectUI2, simpleSubscriberAddress) {
    this.publicClient = publicClient2;
    this.tonConnectUI = tonConnectUI2;
    if (simpleSubscriberAddress) {
      this.simpleSubscriberAddress = simpleSubscriberAddress;
      saveContractAddress(simpleSubscriberAddress, SIMPLE_SUBSCRIBER_STORAGE_KEY);
    }
  }
  getOpenedContract() {
    let contractAddress2 = this.simpleSubscriberAddress;
    if (!contractAddress2) {
      contractAddress2 = loadData(SIMPLE_SUBSCRIBER_STORAGE_KEY)?.address;
      if (!contractAddress2) {
        throw new Error(
          "No simple subscriber address found. Did you deploy the simple subscriber?"
        );
      }
    }
    const contractAddressParsed = Address.parse(contractAddress2);
    return this.publicClient.open(v.fromAddress(contractAddressParsed));
  }
  async deploy(args) {
    const deployer = this.tonConnectUI.account?.address;
    if (!deployer) {
      throw new Error("No account connected. Did you connect to the wallet?");
    }
    const simpleSubscriber = await v.fromInit(
      Address.parse(deployer),
      args.subscriberId
    );
    const message = {
      address: simpleSubscriber.address.toString(),
      amount: (toNano$1(1) + (Bo + Io) * args.notificationsCount).toString(),
      payload: beginCell().store(
        pe({
          $$type: "SimpleSubscriberDeploy",
          queryId: args.queryId,
          stream: Address.parse(args.stream),
          notificationsCount: args.notificationsCount,
          expiration: args.expiration
        })
      ).endCell().toBoc().toString("base64")
    };
    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });
    return this;
  }
  async checkTimeout(args) {
    const checker = this.tonConnectUI.account?.address;
    if (!checker) {
      throw new Error("No account connected. Did you connect to the wallet?");
    }
    const contract = this.getOpenedContract();
    const message = {
      address: contract.address.toString(),
      amount: toNano$1(1).toString(),
      payload: beginCell().store(
        ce({
          $$type: "SubscriberCheckTimeout",
          queryId: args.queryId
        })
      ).endCell().toBoc().toString("base64")
    };
    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });
    return this;
  }
  async getBalance() {
    return this.getOpenedContract().getBalance();
  }
  async getDeployerAddress() {
    return this.getOpenedContract().getDeployerAddress();
  }
  async getNotificationsCount() {
    return this.getOpenedContract().getNotificationsCount();
  }
  async getExpiration() {
    return this.getOpenedContract().getExpiration();
  }
  async getStreamAddress() {
    return this.getOpenedContract().getStreamAddress();
  }
  async getSessionAddress() {
    return this.getOpenedContract().getSessionAddress();
  }
  async getLatestCandlestick() {
    return this.getOpenedContract().getLatestCandlestick();
  }
}
class SubscriptionBatchWrapper {
  publicClient;
  batchId;
  streamAddress;
  subscriptionBatch;
  constructor(publicClient2, batchId) {
    this.publicClient = publicClient2;
    this.batchId = batchId;
    const streamAddress = loadData(DATA_STREAM_STORAGE_KEY)?.address;
    if (streamAddress) {
      this.streamAddress = Address.parse(streamAddress);
    }
    this.saveSubscriptionBatch();
  }
  // FIXME: If a batch is not deployed, we still save it address in the local storage
  // Ideally, we should save the batch only after it is deployed
  async saveSubscriptionBatch() {
    if (!this.streamAddress) {
      return;
    }
    const newSubscriptionBatch = await G.fromInit(this.streamAddress, this.batchId);
    const existingBatches = loadData(SUBSCRIPTION_BATCHES_STORAGE_KEY) || [];
    const existingBatch = existingBatches.findIndex(
      (batch) => batch.address === newSubscriptionBatch.address.toString()
    );
    if (existingBatch === -1) {
      existingBatches.push({
        address: newSubscriptionBatch.address.toString(),
        timestamp: Date.now()
      });
      localStorage.setItem(SUBSCRIPTION_BATCHES_STORAGE_KEY, JSON.stringify(existingBatches));
    }
  }
  async getOpenedContract() {
    if (this.subscriptionBatch) {
      return this.subscriptionBatch;
    }
    if (!this.streamAddress) {
      throw new Error("No stream address found. Did you deploy the data stream?");
    }
    const subscriptionBatch = await G.fromInit(this.streamAddress, this.batchId);
    const openedContract = this.publicClient.open(subscriptionBatch);
    this.subscriptionBatch = openedContract;
    return openedContract;
  }
  async getBalance() {
    return (await this.getOpenedContract()).getBalance();
  }
  async getStreamAddress() {
    return (await this.getOpenedContract()).getStreamAddress();
  }
  async getBatchId() {
    return (await this.getOpenedContract()).getBatchId();
  }
  async getSubscriptions() {
    return (await this.getOpenedContract()).getSubscriptions();
  }
  async getSubscriptionsCount() {
    return (await this.getOpenedContract()).getSubscriptionsCount();
  }
}
const publicClient = readable(void 0, (set) => {
  set(
    new TonClient4({
      endpoint: "https://testnet-v4.tonhubapi.com/"
    })
  );
});
const createDataStream = (streamAddress) => {
  return derived(
    [publicClient, tonConnectUI, streamAddress ? streamAddress : readable("")],
    ([$publicClient, $tonConnectUI, $streamAddress], set) => {
      const wrapper = new DataStreamWrapper($publicClient, $tonConnectUI, $streamAddress);
      set(wrapper);
    }
  );
};
const useSubscriptioBatch = (batchId) => {
  return derived([publicClient, batchId], ([$publicClient, $batchId], set) => {
    const wrapper = new SubscriptionBatchWrapper($publicClient, BigInt($batchId));
    set(wrapper);
  });
};
const useSession = (subscriberAddress) => {
  return derived(
    [publicClient, tonConnectUI, subscriberAddress],
    ([$publicClient, $tonConnectUI, $subscriberAddress], set) => {
      const wrapper = new SessionWrapper($publicClient, $tonConnectUI, $subscriberAddress);
      set(wrapper);
    }
  );
};
const createSimpleSubscriber = (subscriberAddress) => {
  return derived(
    [publicClient, tonConnectUI, subscriberAddress ? subscriberAddress : readable("")],
    ([$publicClient, $tonConnectUI, $subscriberAddress], set) => {
      const wrapper = new SimpleSubscriberWrapper($publicClient, $tonConnectUI, $subscriberAddress);
      set(wrapper);
    }
  );
};
const createBrokerage = () => {
  const provider = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: "9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c"
  });
  return derived([sender, tonConnectUI], ([$sender, $tonConnectUI], set) => {
    const getOwner = async () => {
      const brokerageAddress = localStorage.getItem("brokerage");
      if (!brokerageAddress) {
        throw new Error("No brokerage found. Did you deploy a brokerage?");
      }
      const brokerage = provider.open(_.fromAddress(Address.parse(brokerageAddress)));
      return await brokerage.getOwner();
    };
    const getStorageReserve = async () => {
      const brokerageAddress = localStorage.getItem("brokerage");
      if (!brokerageAddress) {
        throw new Error("No brokerage found. Did you deploy a brokerage?");
      }
      const brokerage = provider.open(_.fromAddress(Address.parse(brokerageAddress)));
      return await brokerage.getStorageReserve();
    };
    const getBroker = async (stream) => {
      const brokerageAddress = localStorage.getItem("brokerage");
      if (!brokerageAddress) {
        throw new Error("No brokerage found. Did you deploy a brokerage?");
      }
      const brokerage = provider.open(_.fromAddress(Address.parse(brokerageAddress)));
      return await brokerage.getBroker(stream);
    };
    const getAccount = async (trader) => {
      const brokerageAddress = localStorage.getItem("brokerage");
      if (!brokerageAddress) {
        throw new Error("No brokerage found. Did you deploy a brokerage?");
      }
      const brokerage = provider.open(_.fromAddress(Address.parse(brokerageAddress)));
      return await brokerage.getAccount(trader);
    };
    const deploy = async (args) => {
      const owner = $tonConnectUI.account?.address;
      if (!owner) {
        throw new Error("No account connected. Did you connect to the wallet?");
      }
      const brokerage = provider.open(await _.fromInit(Address.parse(owner)));
      localStorage.setItem("brokerage", brokerage.address.toString({ testOnly: true }));
      await $tonConnectUI?.sendTransaction({
        validUntil: Math.floor(Date.now() / 1e3) + 360,
        messages: [
          {
            address: brokerage.address.toString(),
            amount: toNano$1("0.2").toString(),
            stateInit: beginCell().store(
              mt({
                $$type: "StateInit",
                ...brokerage.init
              })
            ).endCell().toBoc().toString("base64"),
            payload: beginCell().store(
              me({
                $$type: "BRGDeploy",
                queryId: args.queryId
              })
            ).endCell().toBoc().toString("base64")
          }
        ]
      });
    };
    const deployBroker = async (args) => {
      const brokerageAddress = localStorage.getItem("brokerage");
      if (!brokerageAddress) {
        throw new Error("No brokerage found. Did you deploy a brokerage?");
      }
      const brokerage = provider.open(_.fromAddress(Address.parse(brokerageAddress)));
      await brokerage.send(
        $sender,
        {
          value: BRG_DEPLOY_BROKER_DEPOSIT
        },
        { $$type: "BRGDeployBroker", queryId: args.queryId, stream: args.stream }
      );
    };
    const deployAccount = async (args) => {
      const brokerageAddress = localStorage.getItem("brokerage");
      if (!brokerageAddress) {
        throw new Error("No brokerage found. Did you deploy a brokerage?");
      }
      const brokerage = provider.open(_.fromAddress(Address.parse(brokerageAddress)));
      await brokerage.send(
        $sender,
        {
          value: BRG_DEPLOY_ACCOUNT_DEPOSIT
        },
        { $$type: "BRGDeployAccount", queryId: args.queryId }
      );
    };
    set({
      getOwner,
      getStorageReserve,
      getBroker,
      getAccount,
      deploy,
      deployBroker,
      deployAccount
    });
  });
};
const useBroker = (brokerAddress) => {
  const provider = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: "9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c"
  });
  return derived(
    [sender, tonConnectUI, brokerAddress],
    ([$sender, $tonConnectUI, $brokerAddress], set) => {
      const getBalance = async () => {
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        return await broker.getBalance();
      };
      const getStorageReserve = async () => {
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        return await broker.getStorageReserve();
      };
      const getOptionAddress = async (optionId) => {
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        return await broker.getOptionAddress(optionId);
      };
      const getOwner = async () => {
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        return await broker.getOwner();
      };
      const getStream = async () => {
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        return await broker.getStream();
      };
      const getPayout = async () => {
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        return await broker.getPayout();
      };
      const getPayoutRatio = async () => {
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        return await broker.getPayoutRatio();
      };
      const getNextOptionId = async () => {
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        return await broker.getNextOptionId();
      };
      const deploy = async (args) => {
        const owner = $tonConnectUI.account?.address;
        if (!owner) {
          throw new Error("No account connected. Did you connect to the wallet?");
        }
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        await broker.send(
          $sender,
          {
            value: toNano$1("0.2")
          },
          { $$type: "BRKDeploy", queryId: args.queryId }
        );
      };
      const deposit = async (args) => {
        const owner = $tonConnectUI.account?.address;
        if (!owner) {
          throw new Error("No account connected. Did you connect to the wallet?");
        }
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        console.log("toNano('0.05') + toNano(args.deposit)", toNano$1("0.05") + args.deposit);
        await broker.send(
          $sender,
          {
            value: toNano$1("0.05") + args.deposit
          },
          { $$type: "BRKDeposit", queryId: args.queryId }
        );
      };
      const withdraw = async (args) => {
        const owner = $tonConnectUI.account?.address;
        if (!owner) {
          throw new Error("No account connected. Did you connect to the wallet?");
        }
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        await broker.send(
          $sender,
          {
            value: toNano$1("0.2")
          },
          { $$type: "BRKWithdraw", queryId: args.queryId }
        );
      };
      const deployOption = async (args) => {
        const deployer = $tonConnectUI.account?.address;
        if (!deployer) {
          throw new Error("No account connected. Did you connect to the wallet?");
        }
        const broker = provider.open(R.fromAddress(Address.parse($brokerAddress)));
        const message = {
          address: broker.address.toString(),
          amount: (args.draft.investment + toNano$1("2")).toString(),
          payload: beginCell().store(
            O({
              $$type: "BrokerDeployOption",
              queryId: args.queryId,
              draft: {
                $$type: "CashOrNothingOptionDraftAgreement",
                ...args.draft
              }
            })
          ).endCell().toBoc().toString("base64")
        };
        await $tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1e3) + 360,
          messages: [message],
          network: CHAIN.TESTNET
        });
      };
      set({
        getStorageReserve,
        deploy,
        withdraw,
        deposit,
        getOwner,
        getStream,
        getPayout,
        getPayoutRatio,
        getNextOptionId,
        getOptionAddress,
        deployOption,
        getBalance
      });
    }
  );
};
const useBrokerageAccount = (brokerageAddress) => {
  const provider = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: "9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c"
  });
  return derived([tonConnectUI, brokerageAddress], ([$tonConnectUI, $brokerageAddress], set) => {
    const getStorageReserve = async () => {
      const brokerageAddress2 = localStorage.getItem("brokerage");
      if (!brokerageAddress2) {
        throw new Error("No brokerage found. Did you deploy a brokerage?");
      }
      const brokerageAccount = provider.open(
        await U.fromInit(
          $brokerageAddress ? Address.parse($brokerageAddress) : Address.parse(brokerageAddress2),
          Address.parse($tonConnectUI.account?.address)
        )
      );
      return await brokerageAccount.getStorageReserve();
    };
    const getBrokerage = async () => {
      const brokerageAddress2 = localStorage.getItem("brokerage");
      if (!brokerageAddress2) {
        throw new Error("No brokerage found. Did you deploy a brokerage?");
      }
      const brokerageAccount = provider.open(
        await U.fromInit(
          $brokerageAddress ? Address.parse($brokerageAddress) : Address.parse(brokerageAddress2),
          Address.parse($tonConnectUI.account?.address)
        )
      );
      return await brokerageAccount.getBrokerage();
    };
    const getTrader = async () => {
      const brokerageAddress2 = localStorage.getItem("brokerage");
      if (!brokerageAddress2) {
        throw new Error("No brokerage found. Did you deploy a brokerage?");
      }
      const brokerageAccount = provider.open(
        await U.fromInit(
          $brokerageAddress ? Address.parse($brokerageAddress) : Address.parse(brokerageAddress2),
          Address.parse($tonConnectUI.account?.address)
        )
      );
      return await brokerageAccount.getTrader();
    };
    set({
      getStorageReserve,
      getTrader,
      getBrokerage
    });
  });
};
function saveOptionAddress(option) {
  try {
    const storageKey = OPTIONS_STORAGE_KEY.toString();
    const options = JSON.parse(localStorage.getItem(storageKey) || "{}");
    let optionAddress;
    if (typeof option === "string") {
      optionAddress = option;
    } else {
      optionAddress = option.address.toString({ testOnly: true });
    }
    localStorage.setItem(LATEST_OPTION_STORAGE_KEY.toString(), optionAddress);
    localStorage.setItem(storageKey, JSON.stringify({ ...options, [storageKey]: optionAddress }));
  } catch (e) {
    console.error(e);
    throw e;
  }
}
function getOptionContract(publicClient2) {
  const optionAddress = localStorage.getItem(LATEST_OPTION_STORAGE_KEY.toString());
  if (!optionAddress) {
    throw new Error("No option found. Did you deploy an option?");
  }
  return publicClient2.open($.fromAddress(Address.parse(optionAddress)));
}
const createCashOrNothingOption = (streamAddress) => derived(
  [publicClient, tonConnectUI, sender, streamAddress],
  ([$publicClient, $tonConnectUI, $sender, $streamAddress], set) => {
    const deploy = async (args) => {
      const owner = $tonConnectUI.account?.address;
      if (!owner) {
        throw new Error("No account connected. Did you connect to the wallet?");
      }
      const option = $publicClient.open(
        await $.fromInit(Address.parse(owner), args.optionId)
      );
      saveOptionAddress(option);
      $tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1e3) + 360,
        messages: [
          {
            address: option.address.toString(),
            amount: (args.agreement.investment + args.agreement.payout + toNano$1("1")).toString(),
            payload: beginCell().store(
              X({
                $$type: "CashOrNothingOptionDeploy",
                queryId: args.queryId,
                agreement: {
                  ...args.agreement,
                  $$type: "CashOrNothingOptionAgreement"
                },
                stream: Address.parse($streamAddress)
              })
            ).endCell().toBoc().toString("base64"),
            stateInit: beginCell().store(
              mt({
                $$type: "StateInit",
                ...option.init
              })
            ).endCell().toBoc().toString("base64")
          }
        ]
      });
    };
    const checkTimeout = async (args) => {
      const option = getOptionContract($publicClient);
      await option.send(
        $sender,
        {
          value: toNano$1("0.05")
        },
        {
          $$type: "SubscriberCheckTimeout",
          queryId: args.queryId
        }
      );
    };
    const getOptionId = async () => await getOptionContract($publicClient).getOptionId();
    const getAgreement = async () => await getOptionContract($publicClient).getAgreement();
    const getStrikePrice = async () => await getOptionContract($publicClient).getStrikePrice();
    const getLatestCandlestick = async () => await getOptionContract($publicClient).getLatestCandlestick();
    const getDeployerAddress = async () => await getOptionContract($publicClient).getDeployerAddress();
    const getBalance = async () => await getOptionContract($publicClient).getBalance();
    const getStreamAddress = async () => await getOptionContract($publicClient).getStreamAddress();
    const getNotificationsCount = async () => await getOptionContract($publicClient).getNotificationsCount();
    const getExpiration = async () => await getOptionContract($publicClient).getExpiration();
    const getSessionAddress = async () => await getOptionContract($publicClient).getSessionAddress();
    set({
      deploy,
      checkTimeout,
      getOptionId,
      getAgreement,
      getStrikePrice,
      getLatestCandlestick,
      getBalance,
      getDeployerAddress,
      getStreamAddress,
      getNotificationsCount,
      getExpiration,
      getSessionAddress
    });
  }
);

export { Input as I, Label as L, useBrokerageAccount as a, createCashOrNothingOption as b, createBrokerage as c, createDataStream as d, useSubscriptioBatch as e, useSession as f, createSimpleSubscriber as g, useBroker as u };
//# sourceMappingURL=index5-DiRIAbbA.js.map
