export const ADMIN_TRANSACTION_SORT_KEYS = {
  CREATED_AT: "created_at",
  PAID_AT: "paid_at",
  UNIT_AMOUNT: "unit_amount",
  STATUS: "status",
  CURRENCY: "currency",
} as const;

export const ADMIN_SUBSCRIPTION_SORT_KEYS = {
  CREATED_AT: "created_at",
  STARTED_AT: "started_at",
  CURRENT_PERIOD_END: "current_period_end",
  UNIT_AMOUNT: "unit_amount",
  STATUS: "status",
  INTERVAL: "interval",
} as const;
