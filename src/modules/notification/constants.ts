// src/modules/notification/constants.ts

export const NOTIFICATION_FILTERS = {
  ALL: "all",
  UNREAD: "unread",
  READ: "read",
} as const;

export type TNotificationFilter =
  (typeof NOTIFICATION_FILTERS)[keyof typeof NOTIFICATION_FILTERS];

export const NOTIFICATION_SOCKET_TYPES = {
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",
  SUBSCRIPTION_CREATED: "subscription_created",
  SUBSCRIPTION_CANCELED: "subscription_canceled",
  SUBSCRIPTION_RESUMED: "subscription_resumed",
  WELCOME: "welcome",
  SIGN_IN_ALERT: "sign_in_alert",
  AI_RESPONSE_READY: "ai_response_ready",
  AI_RESPONSE_FAILED: "ai_response_failed",
  TTS_READY: "tts_ready",
  TTS_FAILED: "tts_failed",
  ASSET_COMPRESSED: "asset_compressed",
  ASSET_COMPRESSION_FAILED: "asset_compression_failed",
  ASSET_COMPRESSING: "asset_compressing",
} as const;
