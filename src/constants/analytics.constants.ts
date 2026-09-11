export const ANALYTICS_EVENTS = {
  SIGN_UP: "sign_up",
  SIGN_IN: "sign_in",
  SIGN_OUT: "sign_out",
  BEGIN_ONBOARDING: "begin_onboarding",
  COMPLETE_ONBOARDING: "complete_onboarding",
  VIEW_PAGE: "view_page",
  VIEW_PRODUCT: "view_product",
  PURCHASE_PRODUCT: "purchase_product",
  OPEN_NOTIFICATION: "open_notification",
} as const;

export type TAnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export const ANALYTICS_PARAMS = {
  PLATFORM: "platform",
  METHOD: "method",
  PAGE_PATH: "page_path",
  PAGE_TITLE: "page_title",
  PRODUCT_ID: "product_id",
  PRODUCT_NAME: "product_name",
  CURRENCY: "currency",
  UNIT_AMOUNT: "unit_amount",
  PURCHASE_ID: "purchase_id",
  NOTIFICATION_ID: "notification_id",
} as const;

export const ANALYTICS_PLATFORMS = {
  WEB: "web",
  ANDROID: "android",
  IOS: "ios",
} as const;

export const ANALYTICS_AUTH_METHODS = {
  EMAIL: "email",
  GOOGLE: "google",
  APPLE: "apple",
} as const;
