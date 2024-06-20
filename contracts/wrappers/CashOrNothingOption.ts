export * from "../build/CashOrNothingOption/tact_CashOrNothingOption";

export const CashOrNothingOptionType = {
  Call: true as const,
  Put: false as const,
} as const;
