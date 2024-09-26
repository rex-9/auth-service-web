import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "./pages";
import AppRoutes from "./AppRoutes";
import {
  SignIn,
  SignUp,
  SignOut,
  ConfirmEmail,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
} from "./pages";
import { PublicRoute, ProtectedRoute, LoadingOverlay } from "./components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppConfig from "./AppConfig";
import { AuthProvider, LoadingProvider } from "./contexts";

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={AppConfig.GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <LoadingProvider>
          <LoadingOverlay />
          <Router>
            <Routes>
              <Route
                path={AppRoutes.client.public.CONFIRM_EMAIL}
                element={<PublicRoute element={<ConfirmEmail />} />}
              />
              <Route
                path={AppRoutes.client.public.VERIFY_EMAIL}
                element={<PublicRoute element={<VerifyEmail />} />}
              />
              <Route
                path={AppRoutes.client.public.FORGOT_PASSWORD}
                element={<PublicRoute element={<ForgotPassword />} />}
              />
              <Route
                path={AppRoutes.client.public.RESET_PASSWORD}
                element={<PublicRoute element={<ResetPassword />} />}
              />
              <Route
                path={AppRoutes.client.public.SIGN_IN}
                element={<PublicRoute element={<SignIn />} />}
              />
              <Route
                path={AppRoutes.client.public.SIGN_UP}
                element={<PublicRoute element={<SignUp />} />}
              />
              <Route
                path={AppRoutes.client.protected.SIGN_OUT}
                element={<ProtectedRoute element={<SignOut />} />}
              />
              <Route
                path={AppRoutes.client.protected.HOME}
                element={<ProtectedRoute element={<Home />} />}
              />
            </Routes>
          </Router>
        </LoadingProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
