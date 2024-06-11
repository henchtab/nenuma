// BEGIN Data Stream

const DST_STORAGE_RESERVE: Int = ton("1.00");
const DST_BATCHES_COUNT_LIMIT: Int = 10;

const DST_DEPLOY_BATCH_DEPOSIT: Int = ton("5.00");
const DST_DEPLOY_SESSION_DEPOSIT: Int = ton("5.00");

const ERR_ACCESS_DENIED: Int = 400;
const ERR_INSUFFICIENT_DEPOSIT: Int = 401;
const ERR_BATCH_LIMIT_EXCEEDED: Int = 402;

// END Data Stream

// BEGIN Subsription Batch

const BS_STORAGE_RESERVE: Int = ton("1.00");

// END Subscription Batch

// BEGIN Session

const SES_STORAGE_RESERVE: Int = ton("1.00");

const  SB_SUBSCRIBE_DEPOSIT: Int = 10 * 1_000_000_000;
const DST_SUBSCRIBE_DEPOSIT: Int = 20 * 1_000_000_000;
const SES_SUBSCRIBE_DEPOSIT: Int = 30 * 1_000_000_000;

// END Session