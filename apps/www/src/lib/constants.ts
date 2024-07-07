import { toNano } from '@ton/ton';

export const TON_PROOF_REFRESH_INTERVAL_MS = 1000 * 60 * 9; // 9 minutes
export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REDIRECT_URL_COOKIE = 'redirect_url';
export const COOKIE_EXPIRES = new Date(Date.now() + 1000 * 60 * 60 * 24 * 180);

export const DST_DEPLOY_DEPOSIT = toNano('0.2');

export const NOTIFICATION_PREMIUM = toNano('0.01');
export const NOTIFICATION_DEPOSIT = toNano('0.03');

export const DST_DEPLOY_BATCH_DEPOSIT = toNano('0.10');
export const DST_DEPLOY_SESSION_DEPOSIT = toNano('0.2');
export const DST_PUBLISH_CANDLESTICK_DEPOSIT = toNano('5');

export const SES_STORAGE_RESERVE = toNano('0.01');
export const SES_SUBSCRIBE_DEPOSIT = toNano('0.05');
export const SES_UNSUBSCRIBE_DEPOSIT = toNano('0.2');
export const SES_DESTROY_DEPOSIT = toNano('0.2');

export const BRG_DEPLOY_BROKER_DEPOSIT = toNano('0.2');
export const BRG_DEPLOY_ACCOUNT_DEPOSIT = toNano('0.2');

export const BRK_DEPOSIT_DEPOSIT = toNano('0.2');
export const BRK_WITHDRAW_DEPOSIT = toNano('0.2');

// BEIGN: TON Connect UI

export const TON_CONNECT_UI_CONTEXT = 'tonConnect';
export const TON_CONNECT_UI_KEY = 'tonConnectUI';
export const TON_VALID_UNTIL = 360; // Seconds

// END: TON Connect UI

// BEGIN: Storage keys

export const DATA_STREAM_STORAGE_KEY = 'data-stream';
export const LATEST_SUBSCRIPTION_BATCH_STORAGE_KEY = 'latest-subscription-batch';
export const SUBSCRIPTION_BATCHES_STORAGE_KEY = 'subscription-batches';
export const SESSION_STORAGE_KEY = 'session';
export const SIMPLE_SUBSCRIBER_STORAGE_KEY = 'simple-subscriber';

export const LATEST_OPTION_STORAGE_KEY = 'latest-cash-or-nothing-option';
export const OPTIONS_STORAGE_KEY = 'cash-or-nothing-options';

// END: Storage keys
