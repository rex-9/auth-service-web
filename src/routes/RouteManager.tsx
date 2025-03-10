import AppRoutes from "../AppRoutes";
import { ProtectedRoute, PublicRoute } from ".";
import {
  SignInPage,
  SignUpPage,
  SignOutPage,
  ConfirmEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  NotFoundPage,
  HomePage,
  RootPage,
  ProfilePage,
} from "../pages";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

const RouteManager = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={AppRoutes.client.public.ROOT}>
        <Route index element={<RootPage />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path={AppRoutes.client.protected.SIGN_OUT}
            element={<SignOutPage />}
          />
          <Route
            path={AppRoutes.client.protected.HOME}
            element={<HomePage />}
          />
          <Route
            path={AppRoutes.client.protected.PROFILE}
            element={<ProfilePage />}
          />
        </Route>
        <Route element={<PublicRoute />}>
          <Route
            path={AppRoutes.client.public.CONFIRM_EMAIL}
            element={<ConfirmEmailPage />}
          />
          <Route
            path={AppRoutes.client.public.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
          <Route
            path={AppRoutes.client.public.RESET_PASSWORD}
            element={<ResetPasswordPage />}
          />
          <Route
            path={AppRoutes.client.public.SIGN_IN}
            element={<SignInPage />}
          />
          <Route
            path={AppRoutes.client.public.SIGN_UP}
            element={<SignUpPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default RouteManager;
