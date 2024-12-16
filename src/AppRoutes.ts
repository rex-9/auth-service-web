class AppRoutes {
  // private static readonly PROTECTED_PREFIX = "/auth";

  static readonly client = {
    public: {
      SIGN_IN: "/signin",
      SIGN_UP: "/signup",
      CONFIRM_EMAIL: "/email/confirm",
      FORGOT_PASSWORD: "/password/forgot",
      RESET_PASSWORD: "/password/reset",
      ROOT: "/",
    },
    protected: {
      SIGN_OUT: "/signout",
      HOME: "/home",
      PROFILE: "/profile",
    },
  };

  static readonly server = {
    public: {
      SIGN_UP: "/signup",
      SIGN_IN_EMAIL: "/signin",
      SIGN_IN_TOKEN: "/signin/token",
      SIGN_IN_GOOGLE: "/signin/google",
      RESEND_VERIFY_EMAIL: "/confirmation/resend",
      CONFIRM_WITH_CODE: "/confirmation/confirm_with_code",
      FORGOT_PASSWORD: "/password/forgot",
      RESET_PASSWORD: "/password/reset",
    },
    protected: {
      SIGN_OUT: "/signout",
      GET_CURRENT_USER: "/users/current",
      UPLOAD_ASSET: "/media/upload",
    },
  };
}

export default AppRoutes;
