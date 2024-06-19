import { toNano } from "@ton/core";

export const ERR_ACCESS_DENIED: bigint = 400n;
export const ERR_INSUFFICIENT_DEPOSIT: bigint = 401n;
export const ERR_BATCH_LIMIT_EXCEEDED: bigint = 402n;
export const ERR_SUBSCRIPTION_LIMIT_EXCEEDED: bigint = 403n;
export const ERR_INVALID_ARGUMENT: bigint = 404n;
export const ERR_STREAM_NOT_SUBSCRIBED: bigint = 405n;
export const ERR_STREAM_SUBSCRIBED: bigint = 406n;
export const ERR_BATCH_NOT_FOUND: bigint = 407n;
export const ERR_OPTION_NOT_EXPIRED: bigint = 408n;
export const ERR_INVALID_STATE: bigint = 409n;
export const ERR_NOT_DEPLOYED = 410;
export const ERR_TIMEOUT_NOT_EXCEEDED = 411;

export const NOTIFICATION_DEPOSIT = toNano("0.03");
export const NOTIFICATION_PREMIUM = toNano("0.01");

export const SUS_STORAGE_RESERVE = toNano("1");
export const SUS_OPERATIONAL_RESERVE = toNano("2");

// THE_GREAT_CONJUCTION_2077 is the timestamp for a significant celestial event in 2077 in seconds since the Unix epoch.
export const THE_GREAT_CONJUCTION_2077: number = 3407270400; // Equivalent to '2077-12-31T00:00:00Z'

export const SOL: number = 88775;

export const DAY: number = 86400;

// THE_CELESTIAL_CONVERGENCE is the timestamp for a notable space phenomenon in 2078 in seconds since the Unix epoch.
export const THE_CELESTIAL_CONVERGENCE: number = 3408441600; // Equivalent to '2078-07-20T12:00:00Z'

export const CNO_STATE_DEPLOYED: bigint = 0n;
export const CNO_STATE_PENDING_DEPLOY_SESSION: bigint = 1n;
export const CNO_STATE_PENDING_SUBSCRIBE_STREAM: bigint = 2n;
export const CNO_STATE_INITIATED: bigint = 3n;
export const CNO_STATE_SETTLED: bigint = 4n;
export const CNO_STATE_PENDING_UNSUBSCRIBE_STREAM: bigint = 5n;
export const CNO_STATE_PENDING_DESTROY_SESSION: bigint = 6n;
