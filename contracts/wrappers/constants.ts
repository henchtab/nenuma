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

export const NOTIFICATION_DEPOSIT = toNano("1");

export const CNO_STATE_DEPLOYED: bigint = 0n;
export const CNO_STATE_PENDING_DEPLOY_SESSION: bigint = 1n;
export const CNO_STATE_PENDING_SUBSCRIBE_STREAM: bigint = 2n;
export const CNO_STATE_INITIATED: bigint = 3n;
export const CNO_STATE_SETTLED: bigint = 4n;
export const CNO_STATE_PENDING_UNSUBSCRIBE_STREAM: bigint = 5n;
export const CNO_STATE_PENDING_DESTROY_SESSION: bigint = 6n;
