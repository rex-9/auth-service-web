export const AppLocales = {
  AUTH: {
    SIGN_IN: {
      TITLE: "auth.sign_in.title",
      EMAIL_OR_USERNAME_LABEL: "auth.sign_in.email_or_username_label",
      PASSWORD_LABEL: "auth.sign_in.password_label",
      BUTTON: "auth.sign_in.button",
      SIGN_UP_PROMPT: "auth.sign_in.sign_up_prompt",
      SIGN_UP_LINK: "auth.sign_in.sign_up_link",
      FORGOT_PASSWORD_PROMPT: "auth.sign_in.forgot_password_prompt",
      FORGOT_PASSWORD_LINK: "auth.sign_in.forgot_password_link",
      GOOGLE_FAILURE: "auth.sign_in.google_failure",
    },
    SIGN_UP: {
      TITLE: "auth.sign_up.title",
      USERNAME_LABEL: "auth.sign_up.username_label",
      EMAIL_LABEL: "auth.sign_up.email_label",
      PASSWORD_LABEL: "auth.sign_up.password_label",
      PASSWORD_CONFIRMATION_LABEL: "auth.sign_up.password_confirmation_label",
      BUTTON: "auth.sign_up.button",
      SIGN_IN_PROMPT: "auth.sign_up.sign_in_prompt",
      SIGN_IN_LINK: "auth.sign_up.sign_in_link",
    },
    SIGN_OUT: "auth.sign_out",
  },
  COMMON: {
    HOME: "common.home",
    GO_BACK: "common.go_back",
    SUBMIT: "common.submit",
    SAVE: "common.save",
    CANCEL: "common.cancel",
    CLOSE: "common.close",
    LANGUAGE: "common.language",
  },
} as const;

// Type for type safety
export type AppLocaleKeys = keyof typeof AppLocales;

// Usage example:
// const key = AppLocales.auth.signIn.title
// const commonKey = AppLocales.common.submit
