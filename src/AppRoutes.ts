import { DialogParams } from "./modules/auth/constants";

class AppRoutes {
  private static readonly API_VERSION = "/v1";

  private static api(path: string): string {
    return `${this.API_VERSION}${path}`;
  }

  private static adminApi(path: string): string {
    return `${this.API_VERSION}/admin${path}`;
  }

  private static admin(path: string): string {
    return `/admin${path}`;
  }

  static withId(path: string, id: string): string {
    return path.replace(":id", id);
  }

  static readonly client = {
    public: {
      SIGN_IN: "/signin",
      SIGN_UP: "/signup",
      CONFIRM_EMAIL: "/email/confirm",
      FORGOT_PASSWORD: "/password/forgot",
      RESET_PASSWORD: "/password/reset",
      ANAPANA: "/anapana",
      ROOT: "/",
    },

    protected: {
      SIGN_OUT: "/signout",
      HOME: "/home",
      PROFILE: "/profile",
      PAYMENT: "/payment",
      PAYMENT_SUCCESS: "/payment/success",
      PAYMENT_CANCEL: "/payment/cancel",
      AI: "/ai",

      // Client Admin Dashboard
      admin: {
        HOME: AppRoutes.admin("/"),
        ANALYTICS: AppRoutes.admin("/analytics"),
        USERS: AppRoutes.admin("/users"),
        USERS_RECYCLE_BIN: AppRoutes.admin("/users/bin"),
        USER_CREATE: AppRoutes.admin("/users/create"),
        USER_EDIT: AppRoutes.admin("/users/:id/edit"),
        ROLES: AppRoutes.admin("/roles"),
        ROLES_RECYCLE_BIN: AppRoutes.admin("/roles/bin"),
        ROLE_CREATE: AppRoutes.admin("/roles/create"),
        ROLE_EDIT: AppRoutes.admin("/roles/:id/edit"),
        NOTIFICATIONS: AppRoutes.admin("/notifications"),
        NOTIFICATION_CREATE: AppRoutes.admin("/notifications/create"),
        NOTIFICATION_EDIT: AppRoutes.admin("/notifications/:id/edit"),
        PRODUCTS: AppRoutes.admin("/products"),
        PRODUCTS_RECYCLE_BIN: AppRoutes.admin("/products/bin"),
        PRODUCT_CREATE: AppRoutes.admin("/products/create"),
        PRODUCT_EDIT: AppRoutes.admin("/products/:id/edit"),
        ASSETS: AppRoutes.admin("/assets"),
        ASSETS_RECYCLE_BIN: AppRoutes.admin("/assets/bin"),
        ASSET_CREATE: AppRoutes.admin("/assets/create"),
        ASSET_EDIT: AppRoutes.admin("/assets/:id/edit"),
        ACCESSES: AppRoutes.admin("/accesses"),
        ACCESS_CREATE: AppRoutes.admin("/accesses/create"),
        ACCESS_EDIT: AppRoutes.admin("/accesses/:id/edit"),
        FEEDBACK: AppRoutes.admin("/feedback"),
        FEEDBACK_DETAIL: AppRoutes.admin("/feedback/:id"),
        LOGS: AppRoutes.admin("/logs"),
        LOGS_RECYCLE_BIN: AppRoutes.admin("/logs/bin"),
        LOG_DETAIL: AppRoutes.admin("/logs/:id"),
        CHAT_ROOMS: AppRoutes.admin("/chat/rooms"),
        CHAT_ROOMS_RECYCLE_BIN: AppRoutes.admin("/chat/rooms/bin"),
        CHAT_ROOM_EDIT: AppRoutes.admin("/chat/rooms/:id/edit"),
        CHAT_MESSAGES: AppRoutes.admin("/chat/messages"),
        CHAT_MESSAGES_RECYCLE_BIN: AppRoutes.admin("/chat/messages/bin"),
        CHAT_MESSAGE_EDIT: AppRoutes.admin("/chat/messages/:id/edit"),
        VERSIONS: AppRoutes.admin("/versions"),
        VERSIONS_RECYCLE_BIN: AppRoutes.admin("/versions/bin"),
        VERSION_CREATE: AppRoutes.admin("/versions/create"),
        VERSION_EDIT: AppRoutes.admin("/versions/:id/edit"),
        VERSION_INSTALLS: AppRoutes.admin("/versions/:id/user-versions"),
        USER_VERSIONS: AppRoutes.admin("/user-versions"),
      },
    },
  };

  static readonly server = {
    public: {
      // Authentication
      PEEK_USER: "/peek", // GET
      SIGN_UP: "/signup", // POST
      SIGN_IN_EMAIL: "/signin", // POST
      SIGN_IN_TOKEN: "/signin/token", // POST
      SIGN_IN_GOOGLE: "/signin/google", // POST
      SIGN_IN_GOOGLE_COMPLETE: "/signin/google/complete", // POST

      // Email confirmation
      SEND_EMAIL_CODE: "/confirmation/send_code", // POST
      CONFIRM_CODE: "/confirmation/confirm_code", // POST

      // Password
      FORGOT_PASSWORD: "/password/forgot", // POST
      RESET_PASSWORD: "/password/reset", // PUT

      // Feedback
      FEEDBACK: AppRoutes.api("/feedbacks"), // POST
    },

    protected: {
      // Authentication
      SIGN_OUT: "/signout", // DELETE

      // Save Client Log Errors
      CLIENT_LOGS: AppRoutes.api("/log/clients"), // POST

      // Users
      USERS: AppRoutes.api("/users"), // GET
      CURRENT_USER: AppRoutes.api("/users/current"), // GET

      IAM_PERMISSIONS: AppRoutes.api("/iam/permissions/current"), // GET
      IAM_ROLES: AppRoutes.api("/iam/roles/current"), // GET

      // Media
      UPLOAD_ASSET: AppRoutes.api("/media/upload"), // POST

      // Accesses
      ACCESSES: AppRoutes.api("/accesses"), // GET
      ACTIVE_ACCESSES: AppRoutes.api("/accesses/active"), // GET
      CHECK_ACCESSES: AppRoutes.api("/accesses/check"), // GET

      // Payments
      PAYMENT_SESSION: AppRoutes.api("/payment/session"), // POST
      PAYMENT_PRODUCTS: AppRoutes.api("/payment/products"), // GET
      PAYMENT_SUBSCRIPTIONS: AppRoutes.api("/payment/subscriptions"), // GET, POST
      PAYMENT_SUBSCRIPTION_CANCEL: AppRoutes.api(
        "/payment/subscriptions/:id/cancel",
      ), // POST
      PAYMENT_SUBSCRIPTION_RESUME: AppRoutes.api(
        "/payment/subscriptions/:id/resume",
      ), // POST
      PAYMENT_TRANSACTIONS: AppRoutes.api("/payment/transactions"), // GET

      // AI
      AI_CHAT: AppRoutes.api("/ai/chat"), // POST
      AI_HISTORY: AppRoutes.api("/ai/history"), // GET
      AI_CLEAR: AppRoutes.api("/ai/clear"), // DELETE
      AI_RENAME: AppRoutes.api("/ai/rename"), // PUT
      AI_ROOMS: AppRoutes.api("/ai/rooms"), // GET, POST
      AI_DELETE_ROOM: AppRoutes.api("/ai/rooms/:id"), // DELETE
      AI_SUMMARIZE: AppRoutes.api("/ai/summarize"), // POST
      AI_TRANSLATE: AppRoutes.api("/ai/translate"), // POST
      AI_ANALYZE: AppRoutes.api("/ai/analyze"), // POST

      // Speech
      SPEECH_TTS: AppRoutes.api("/speech/tts"), // POST
      SPEECH_STT: AppRoutes.api("/speech/stt"), // POST

      // Feedback
      FEEDBACKS: AppRoutes.api("/feedbacks"), // GET

      // Notifications
      NOTIFICATIONS: AppRoutes.api("/notifications"), // GET
      NOTIFICATIONS_UNREAD_COUNT: AppRoutes.api("/notifications/unread_count"), // GET
      NOTIFICATION_READ: AppRoutes.api("/notifications/:id/read"), // PUT
      NOTIFICATIONS_READ_ALL: AppRoutes.api("/notifications/read_all"), // PUT
      NOTIFICATION_DELETE: AppRoutes.api("/notifications/:id"), // DELETE

      // API for Client Admin Dashboard
      admin: {
        USERS: AppRoutes.adminApi("/users"), // GET, POST
        USER_ROLES: AppRoutes.adminApi("/iam/roles"), // GET
        USER_DETAIL: AppRoutes.adminApi("/users/:id"), // GET, PUT
        DISCARDED_USERS: AppRoutes.adminApi("/users/discarded"), // GET
        USER_DISCARD: AppRoutes.adminApi("/users/:id/discard"), // POST
        USER_UNDISCARD: AppRoutes.adminApi("/users/:id/undiscard"), // POST
        IAM_ROLES: AppRoutes.adminApi("/iam/roles"), // GET, POST
        IAM_ROLE_DETAIL: AppRoutes.adminApi("/iam/roles/:id"), // GET, PUT, DELETE
        IAM_ROLE_DISCARD: AppRoutes.adminApi("/iam/roles/:id/discard"), // POST
        IAM_ROLE_UNDISCARD: AppRoutes.adminApi("/iam/roles/:id/undiscard"), // POST
        IAM_PERMISSIONS: AppRoutes.adminApi("/iam/permissions"), // GET, POST
        IAM_PERMISSION_DETAIL: AppRoutes.adminApi("/iam/permissions/:id"), // GET, PUT, DELETE
        IAM_ROLE_PERMISSIONS: AppRoutes.adminApi("/iam/permissions"), // GET
        NOTIFICATIONS: AppRoutes.adminApi("/notifications"), // GET, POST
        NOTIFICATION_DETAIL: AppRoutes.adminApi("/notifications/:id"), // GET, PUT, DELETE
        NOTIFICATION_UNDISCARD: AppRoutes.adminApi("/notifications/:id/undiscard"), // POST
        NOTIFICATION_DISPATCH: AppRoutes.adminApi("/notifications/dispatch"), // POST
        NOTIFICATION_TEMPLATES: AppRoutes.adminApi("/notifications"), // GET, POST
        NOTIFICATION_TEMPLATE_DETAIL: AppRoutes.adminApi("/notifications/:id"), // GET, PUT, DELETE
        NOTIFICATION_TEMPLATE_DISCARD: AppRoutes.adminApi("/notifications/:id"), // DELETE
        NOTIFICATION_TEMPLATE_UNDISCARD: AppRoutes.adminApi("/notifications/:id/undiscard"), // POST
        PAYMENT_PRODUCTS: AppRoutes.adminApi("/payment/products"), // GET, POST
        DISCARDED_PAYMENT_PRODUCTS: AppRoutes.adminApi(
          "/payment/products/discarded",
        ), // GET
        PAYMENT_PRODUCT_DETAIL: AppRoutes.adminApi("/payment/products/:id"), // GET, PUT, DELETE
        PAYMENT_PRODUCT_DISCARD: AppRoutes.adminApi(
          "/payment/products/:id/discard",
        ), // POST
        PAYMENT_PRODUCT_UNDISCARD: AppRoutes.adminApi(
          "/payment/products/:id/undiscard",
        ), // POST
        ASSETS: AppRoutes.adminApi("/assets"), // GET
        ASSET_DETAIL: AppRoutes.adminApi("/assets/:id"), // GET, PUT, DELETE
        DISCARDED_ASSETS: AppRoutes.adminApi("/assets/discarded"), // GET
        ASSET_UPLOAD: AppRoutes.adminApi("/assets/upload"), // POST
        ASSET_DISCARD: AppRoutes.adminApi("/assets/:id/discard"), // POST
        ASSET_UNDISCARD: AppRoutes.adminApi("/assets/:id/undiscard"), // POST
        ASSET_COMPRESS: AppRoutes.adminApi("/assets/:id/compress"), // POST
        ASSET_STORAGE_STATS: AppRoutes.adminApi("/assets/storage_stats"), // GET
        ASSET_EMPTY_RECYCLE_BIN: AppRoutes.adminApi("/assets/bin"), // DELETE
        ASSETS_BATCH_DISCARD: AppRoutes.adminApi("/assets/discard_batch"), // POST
        ASSETS_BATCH_UNDISCARD: AppRoutes.adminApi("/assets/undiscard_batch"), // POST
        ASSETS_BATCH_DESTROY: AppRoutes.adminApi("/assets/destroy_batch"), // POST
        CHAT_ROOMS: AppRoutes.adminApi("/chat/rooms"), // GET
        CHAT_ROOM_DETAIL: AppRoutes.adminApi("/chat/rooms/:id"), // GET, PUT, DELETE
        CHAT_ROOM_DISCARD: AppRoutes.adminApi("/chat/rooms/:id/discard"), // POST
        CHAT_ROOM_UNDISCARD: AppRoutes.adminApi("/chat/rooms/:id/undiscard"), // POST
        CHAT_MESSAGES: AppRoutes.adminApi("/chat/messages"), // GET
        CHAT_MESSAGE_DETAIL: AppRoutes.adminApi("/chat/messages/:id"), // GET, PUT, DELETE
        CHAT_MESSAGE_DISCARD: AppRoutes.adminApi("/chat/messages/:id/discard"), // POST
        CHAT_MESSAGE_UNDISCARD: AppRoutes.adminApi(
          "/chat/messages/:id/undiscard",
        ), // POST
        FEEDBACKS: AppRoutes.adminApi("/feedbacks"), // GET
        FEEDBACK_DETAIL: AppRoutes.adminApi("/feedbacks/:id"), // GET, PUT, DELETE
        ACCESSES: AppRoutes.adminApi("/accesses"), // GET, POST
        ACCESS_DETAIL: AppRoutes.adminApi("/accesses/:id"), // GET, PUT, DELETE
        LOGS: AppRoutes.api("/log/clients"), // GET, POST
        LOG_DETAIL: AppRoutes.api("/log/clients/:id"), // GET, DELETE
        LOG_DISCARD: AppRoutes.api("/log/clients/:id/discard"), // POST
        LOG_UNDISCARD: AppRoutes.api("/log/clients/:id/undiscard"), // POST
        LOG_RESOLVE: AppRoutes.api("/log/clients/:id/resolve"), // PUT
        LOG_UNRESOLVE: AppRoutes.api("/log/clients/:id/unresolve"), // PUT
        ANALYTICS_OVERVIEW: AppRoutes.adminApi("/analytics/overview"), // GET
        APP_VERSIONS: AppRoutes.adminApi("/versions"), // GET, POST
        DISCARDED_APP_VERSIONS: AppRoutes.adminApi("/versions/discarded"), // GET
        APP_VERSION_DETAIL: AppRoutes.adminApi("/versions/:id"), // GET, PUT
        APP_VERSION_DISCARD: AppRoutes.adminApi("/versions/:id/discard"), // POST
        APP_VERSION_UNDISCARD: AppRoutes.adminApi("/versions/:id/undiscard"), // POST
        APP_VERSION_INSTALLS: AppRoutes.adminApi("/versions/:id/user_versions"), // GET
        APP_INSTALLS: AppRoutes.adminApi("/versions/user_versions"), // GET
      },
    },
  };

  // Helper to build dialog URLs
  static buildDialogUrl(step: string, params?: Record<string, string>): string {
    const searchParams = new URLSearchParams({
      [DialogParams.DIALOG]: DialogParams.AUTH,
      [DialogParams.STEP]: step,
    });

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.set(key, value);
      });
    }

    return `${AppRoutes.client.public.ROOT}?${searchParams.toString()}`;
  }
}

export default AppRoutes;
