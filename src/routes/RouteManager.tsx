import AppRoutes from "../AppRoutes";
import { ProtectedRoute, PublicRoute } from ".";
import {
  SignIn,
  SignUp,
  SignOut,
  ConfirmEmail,
  ForgotPassword,
  ResetPassword,
  NotFound,
  Home,
  Root,
  Profile,
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
        <Route index element={<Root />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path={AppRoutes.client.protected.SIGN_OUT}
            element={<SignOut />}
          />
          <Route path={AppRoutes.client.protected.HOME} element={<Home />} />
          <Route
            path={AppRoutes.client.protected.PROFILE}
            element={<Profile />}
          />
        </Route>
        <Route element={<PublicRoute />}>
          <Route
            path={AppRoutes.client.public.CONFIRM_EMAIL}
            element={<ConfirmEmail />}
          />
          <Route
            path={AppRoutes.client.public.FORGOT_PASSWORD}
            element={<ForgotPassword />}
          />
          <Route
            path={AppRoutes.client.public.RESET_PASSWORD}
            element={<ResetPassword />}
          />
          <Route path={AppRoutes.client.public.SIGN_IN} element={<SignIn />} />
          <Route path={AppRoutes.client.public.SIGN_UP} element={<SignUp />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default RouteManager;
