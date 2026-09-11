// src/modules/notification/constants.ts

export const NOTIFICATION_FILTERS = {
  ALL: "all",
  UNREAD: "unread",
  READ: "read",
} as const;

export type TNotificationFilter =
  (typeof NOTIFICATION_FILTERS)[keyof typeof NOTIFICATION_FILTERS];

export const ASYNC_OPERATION_STATUSES = {
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const ASYNC_OPERATION_TYPES = {
  AI_RESPONSE: "ai_response",
  ASSET_COMPRESSION: "asset_compression",
  VIDEO_THUMBNAIL: "video_thumbnail",
  NOTIFICATION_DELIVERY: "notification_delivery",
  PAYMENT_WEBHOOK: "payment_webhook",
} as const;

export type TAsyncOperationStatus =
  (typeof ASYNC_OPERATION_STATUSES)[keyof typeof ASYNC_OPERATION_STATUSES];
export type TAsyncOperationType =
  (typeof ASYNC_OPERATION_TYPES)[keyof typeof ASYNC_OPERATION_TYPES];

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
  ASSET_THUMBNAIL_GENERATED: "asset_thumbnail_generated",
  ASSET_THUMBNAIL_FAILED: "asset_thumbnail_failed",
  IAM_UPDATED: "iam_updated",
} as const;
