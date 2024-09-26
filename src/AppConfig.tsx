class AppConfig {
  static readonly GOOGLE_CLIENT_ID =
    import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID ||
    "1026550055658-skeaoo2ipej0ntv2i5vtj3s7isgdhqg4.apps.googleusercontent.com";
  static readonly SERVER_BASE_URL =
    import.meta.env.VITE_REACT_APP_SERVER_BASE_URL ||
    "http://localhost:3000/api/v1";
  static readonly CLIENT_BASE_URL =
    import.meta.env.VITE_REACT_APP_CLIENT_BASE_URL || "http://localhost:5173";
}

export default AppConfig;
