class AppConfig {
  static readonly NODE_ENV = import.meta.env.NODE_ENV;
  static readonly APP_NAME = import.meta.env.VITE_REACT_APP_NAME || "rexone.me";
  static readonly GOOGLE_CLIENT_ID =
    import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID ||
    "1026550055658-skeaoo2ipej0ntv2i5vtj3s7isgdhqg4.apps.googleusercontent.com";
  static readonly SERVER_BASE_URL =
    import.meta.env.VITE_REACT_APP_SERVER_BASE_URL || "http://localhost:3000";
  static readonly CLIENT_BASE_URL =
    import.meta.env.VITE_REACT_APP_CLIENT_BASE_URL || "http://localhost:4000";
  static readonly SERVER_WS_BASE_URL =
    import.meta.env.VITE_REACT_APP_SERVER_WS_BASE_URL || "ws://localhost:3000";

  // Media upload limits
  static readonly MEDIA_MAX_NON_VIDEO_SIZE_MB = Number(
    import.meta.env.VITE_MEDIA_MAX_NON_VIDEO_SIZE_MB || 10,
  );
  static readonly MEDIA_MAX_VIDEO_SIZE_MB = Number(
    import.meta.env.VITE_MEDIA_MAX_VIDEO_SIZE_MB || 100,
  );
  static readonly MEDIA_MAX_FILE_COUNT = Number(
    import.meta.env.VITE_MEDIA_MAX_FILE_COUNT || 20,
  );
}

export default AppConfig;
