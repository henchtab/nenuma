// BEGIN Errors

// Error codes to be used throughout the contracts for various conditions
const ERR_ACCESS_DENIED: Int = 400; // Access is denied
const ERR_INSUFFICIENT_DEPOSIT: Int = 401; // Insufficient deposit provided
const ERR_BATCH_LIMIT_EXCEEDED: Int = 402; // Batch limit has been exceeded
const ERR_SUBSCRIPTION_LIMIT_EXCEEDED: Int = 403; // Subscription limit has been exceeded
const ERR_INVALID_ARGUMENT: Int = 404; // Invalid argument provided
const ERR_STREAM_NOT_SUBSCRIBED: Int = 405; // Stream is not subscribed
const ERR_STREAM_SUBSCRIBED: Int = 406; // Stream is already subscribed
const ERR_BATCH_NOT_FOUND: Int = 407; // Batch not found
const ERR_OPTION_NOT_EXPIRED: Int = 408; // Option is not expired
const ERR_INVALID_STATE: Int = 409; // Invalid state encountered
const ERR_NOT_DEPLOYED: Int = 410; // Contract not deployed
const ERR_TIMEOUT_NOT_EXCEEDED: Int = 411; // Timeout not exceeded
const ERR_SESSION_ALREADY_EXISTS: Int = 412; // Session already exists
const ERR_SESSION_NOT_FOUND: Int = 413; // Session not found

// END Errors

// BEGIN Data Stream

// Constants related to data stream storage and limits
const DST_STORAGE_RESERVE: Int = ton("0.05"); // Storage reserve for data stream
const BATCH_LIMIT: Int = 10; // Maximum number of batches
const SUBSCRIPTION_LIMIT: Int = 20; // Maximum number of subscriptions
const DECIMALS: Int = 2; // Number of decimals for values
const NOTIFICATION_PREMIUM: Int = ton("0.01"); // Premium for notifications
const NOTIFICATION_DEPOSIT: Int = ton("0.02"); // Deposit for notifications
const DST_DEPLOY_BATCH_DEPOSIT: Int = ton("0.10"); // Deposit for deploying a batch
const DST_DEPLOY_SESSION_DEPOSIT: Int = ton("0.10"); // Deposit for deploying a session
const DST_PUBLISH_CANDLESTICK_DEPOSIT: Int = ton("5"); // Deposit for publishing a candlestick

// END Data Stream

// BEGIN Subscription Batch

// Constants related to subscription batch storage and deposits
const SB_STORAGE_RESERVE: Int = ton("0.05"); // Storage reserve for subscription batch
const SB_PUBLISH_CANDLESTICK_DEPOSIT: Int = ton("0.05"); // Deposit for publishing a candlestick in subscription batch

// END Subscription Batch

// BEGIN Session

// Constants related to session storage and deposits
const SES_STORAGE_RESERVE: Int = ton("0.01"); // Storage reserve for session
const SES_SUBSCRIBE_DEPOSIT: Int = ton("0.05"); // Deposit for subscribing
const SES_UNSUBSCRIBE_DEPOSIT: Int = ton("0.05"); // Deposit for unsubscribing
const SES_DESTROY_DEPOSIT: Int = ton("0.05"); // Deposit for destroying a session

// END Session

// BEGIN Brokerage

// Constants related to brokerage storage and deposits
const BRG_STORAGE_RESERVE: Int = ton("0.01"); // Storage reserve for brokerage
const BRG_DEPLOY_BROKER_DEPOSIT: Int = ton("0.05"); // Deposit for deploying a broker
const BRG_DEPLOY_ACCOUNT_DEPOSIT: Int = ton("0.05"); // Deposit for deploying an account

// END Brokerage

// BEGIN Broker

// Constants related to broker storage and deposits
const BRK_STORAGE_RESERVE: Int = ton("0.01"); // Storage reserve for broker
const BRK_DEPOSIT_DEPOSIT: Int = ton("0.05"); // Deposit for making a deposit
const BRK_WITHDRAW_DEPOSIT: Int = ton("0.05"); // Deposit for making a withdrawal

// END Broker

// BEGIN Brokerage Account

// Constants related to brokerage account storage
const BRA_STORAGE_RESERVE: Int = ton("0.01"); // Storage reserve for brokerage account

// END Brokerage Account

