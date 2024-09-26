class AppRoutes {
  private static readonly PUBLIC_PREFIX = "/public";
  // private static readonly PROTECTED_PREFIX = "/auth";

  static readonly client = {
    public: {
      SIGN_IN: "/signin",
      SIGN_UP: "/signup",
      CONFIRM_EMAIL: "/email/confirm",
      VERIFY_EMAIL: "/email/verify",
      FORGOT_PASSWORD: "/password/forgot",
      RESET_PASSWORD: "/password/reset",
    },
    protected: {
      SIGN_OUT: "/signout",
      HOME: "/",
    },
  };

  static readonly server = {
    public: {
      SIGN_IN_EMAIL: `${AppRoutes.PUBLIC_PREFIX}/signin/email`,
      VERIFY_EMAIL: `${AppRoutes.PUBLIC_PREFIX}/email/verify`,
      RESEND_VERIFY_EMAIL: `${AppRoutes.PUBLIC_PREFIX}/email/verify/resend`,
      SIGN_IN_GOOGLE: `${AppRoutes.PUBLIC_PREFIX}/signin/google`,
      SIGN_UP: `${AppRoutes.PUBLIC_PREFIX}/signup`,
      FORGOT_PASSWORD: `${AppRoutes.PUBLIC_PREFIX}/password/forgot`,
      RESET_PASSWORD: `${AppRoutes.PUBLIC_PREFIX}/password/reset`,
      AUTH_VALIDATE: `${AppRoutes.PUBLIC_PREFIX}/validate`,
    },
    protected: {
      // Example: USER_PROFILE: `${AppRoutes.PROTECTED_PREFIX}/user/profile`,
    },
  };
}

export default AppRoutes;
