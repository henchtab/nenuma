import { toNano } from "@ton/core";

export * from "../build/CashOrNothingOption/tact_CashOrNothingOption";

export const OptionType = {
  Call: true,
  Put: false,
} as const;

export const CNO_STORAGE_RESERVE = toNano("1.00");
export const CNO_OPERATIONAL_DEPOSIT = toNano("1.00");
export const CNO_NOTIFICATION_DEPOSIT = toNano("1.00");
export const CNO_TIMEOUT = 3600n;

export const ERR_OPTION_NOT_EXPIRED = 408n;
export const ERR_INVALID_STATE = 409n;
