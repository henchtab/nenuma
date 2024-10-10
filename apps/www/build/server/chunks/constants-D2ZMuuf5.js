import { toNano } from '@ton/ton';
import './_sentry-release-injection-file-D10jjuQQ.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "442d64c8-8772-4392-b82a-eadfec926303", e._sentryDebugIdIdentifier = "sentry-dbid-442d64c8-8772-4392-b82a-eadfec926303");
  } catch (e2) {
  }
}();
const ACCESS_TOKEN_COOKIE = "access_token";
const REDIRECT_URL_COOKIE = "redirect_url";
const DST_DEPLOY_DEPOSIT = toNano("0.2");
toNano("0.01");
toNano("0.03");
const DST_DEPLOY_BATCH_DEPOSIT = toNano("0.10");
const DST_DEPLOY_SESSION_DEPOSIT = toNano("0.2");
const DST_PUBLISH_CANDLESTICK_DEPOSIT = toNano("5");
toNano("0.01");
const SES_SUBSCRIBE_DEPOSIT = toNano("0.05");
toNano("0.2");
toNano("0.2");
const BRG_DEPLOY_BROKER_DEPOSIT = toNano("0.2");
const BRG_DEPLOY_ACCOUNT_DEPOSIT = toNano("0.2");
toNano("0.2");
toNano("0.2");
const TON_CONNECT_UI_CONTEXT = "tonConnect";
const TON_VALID_UNTIL = 360;
const DATA_STREAM_STORAGE_KEY = "data-stream";
const SUBSCRIPTION_BATCHES_STORAGE_KEY = "subscription-batches";
const SESSION_STORAGE_KEY = "session";
const SIMPLE_SUBSCRIBER_STORAGE_KEY = "simple-subscriber";
const LATEST_OPTION_STORAGE_KEY = "latest-cash-or-nothing-option";
const OPTIONS_STORAGE_KEY = "cash-or-nothing-options";

export { ACCESS_TOKEN_COOKIE as A, BRG_DEPLOY_BROKER_DEPOSIT as B, DST_DEPLOY_DEPOSIT as D, LATEST_OPTION_STORAGE_KEY as L, OPTIONS_STORAGE_KEY as O, REDIRECT_URL_COOKIE as R, SUBSCRIPTION_BATCHES_STORAGE_KEY as S, TON_CONNECT_UI_CONTEXT as T, TON_VALID_UNTIL as a, DST_DEPLOY_BATCH_DEPOSIT as b, DST_DEPLOY_SESSION_DEPOSIT as c, DST_PUBLISH_CANDLESTICK_DEPOSIT as d, BRG_DEPLOY_ACCOUNT_DEPOSIT as e, DATA_STREAM_STORAGE_KEY as f, SESSION_STORAGE_KEY as g, SES_SUBSCRIBE_DEPOSIT as h, SIMPLE_SUBSCRIBER_STORAGE_KEY as i };
//# sourceMappingURL=constants-D2ZMuuf5.js.map
