// BEGIN Errors

const ERR_ACCESS_DENIED: Int = 400;
const ERR_INSUFFICIENT_DEPOSIT: Int = 401;
const ERR_BATCH_LIMIT_EXCEEDED: Int = 402;
const ERR_SUBSCRIPTION_LIMIT_EXCEEDED: Int = 403;
const ERR_INVALID_ARGUMENT: Int = 404;
const ERR_STREAM_NOT_SUBSCRIBED: Int = 405;
const ERR_STREAM_SUBSCRIBED: Int = 406;
const ERR_BATCH_NOT_FOUND: Int = 407;
const ERR_OPTION_NOT_EXPIRED: Int = 408;
const ERR_INVALID_STATE: Int = 409;
const ERR_NOT_DEPLOYED: Int = 410;
const ERR_TIMEOUT_NOT_EXCEEDED: Int = 411;

// END Errors


// BEGIN Data Stream

const DST_STORAGE_RESERVE: Int = ton("0.01");

const BATCH_LIMIT: Int = 10;
const SUBSCRIPTION_LIMIT: Int = 20;
const DECIMALS: Int = 2;

const NOTIFICATION_PREMIUM: Int = ton("0.01");
const NOTIFICATION_DEPOSIT: Int = ton("0.03");

const DST_DEPLOY_BATCH_DEPOSIT: Int = ton("0.05"); // <--
const DST_DEPLOY_SESSION_DEPOSIT: Int = ton("0.05"); // <--
const DST_PUBLISH_CANDLESTICK_DEPOSIT: Int = ton("5"); // <--

// END Data Stream


// BEGIN Subsription Batch

const SB_STORAGE_RESERVE: Int = ton("0.01");
const SB_PUBLISH_CANDLESTICK_DEPOSIT: Int = ton("0.5");

// END Subscription Batch


// BEGIN Session

const SES_STORAGE_RESERVE: Int = ton("0.01");
const SES_SUBSCRIBE_DEPOSIT: Int = ton("0.05"); // <--
const SES_UNSUBSCRIBE_DEPOSIT: Int = ton("0.05"); // <--
const SES_DESTROY_DEPOSIT: Int = ton("0.01"); // <--

// END Session


// BEGIN Brokerage

const BRG_STORAGE_RESERVE: Int = ton("0.01");
const BRG_DEPLOY_BROKER_DEPOSIT: Int = ton("0.05");
const BRG_DEPLOY_ACCOUNT_DEPOSIT: Int = ton("0.05");

// END Brokerage


// BEGIN Broker

const BRK_STORAGE_RESERVE: Int = ton("0.01");
const BRK_DEPOSIT_DEPOSIT: Int = ton("0.05");
const BRK_WITHDRAW_DEPOSIT: Int = ton("0.05");

// END Broker


// BEGIN Brokerage Account

const BRA_STORAGE_RESERVE: Int = ton("0.01");

// END Brokerage Account