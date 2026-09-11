// src/modules/payment/constants.ts

export const SUBSCRIPTION_STATUS = {
  INCOMPLETE: "incomplete",
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
  INCOMPLETE_EXPIRED: "incomplete_expired",
  UNPAID: "unpaid",
  TRIALING: "trialing",
  PAUSED: "paused",
} as const;

export type TSubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const TRANSACTION_STATUS = {
  SUCCEEDED: "succeeded",
  PROCESSING: "processing",
  REQUIRES_ACTION: "requires_action",
  REQUIRES_CAPTURE: "requires_capture",
  REQUIRES_CONFIRMATION: "requires_confirmation",
  REQUIRES_PAYMENT_METHOD: "requires_payment_method",
  CANCELED: "canceled",
} as const;

export type TTransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

export const PAYMENT_MODES = {
  SUBSCRIPTION: "subscription",
  PAYMENT: "payment",
} as const;

export type TPaymentMode = (typeof PAYMENT_MODES)[keyof typeof PAYMENT_MODES];

export const BILLING_INTERVALS = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
} as const;

export type TBillingInterval =
  (typeof BILLING_INTERVALS)[keyof typeof BILLING_INTERVALS];

export const ACCESS_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  REVOKED: "revoked",
} as const;

export type TAccessStatus = (typeof ACCESS_STATUS)[keyof typeof ACCESS_STATUS];
