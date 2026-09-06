// src/routes/RouteManager.tsx

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { AdminHomeRoute } from "./AdminHomeRoute";
import { AdminRootRoute } from "./AdminRootRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { HomePage, NotFoundPage, PageLayout, RootPage } from "../design/pages";
import { UserPage } from "../modules/user";
import { AnapanaRoute } from "../modules/anapana/pages";
import {
  AuthDialog,
  ConfirmEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  SignInPage,
  SignOutPage,
  SignUpPage,
} from "../modules/auth";
import {
  PaymentCancelPage,
  PaymentPage,
  PaymentSuccessPage,
} from "../modules/payment/pages";
import { AiPage } from "../modules/ai/pages";
import {
  ADMIN_ACTIONS,
  ADMIN_RESOURCES,
  AdminAnalyticsPage,
  AdminAccessesPage,
  AdminAccessCreatePage,
  AdminAccessEditPage,
  AdminFeedbacksPage,
  AdminFeedbackDetailPage,
  AdminLogsPage,
  AdminDiscardedLogsPage,
  AdminLogDetailPage,
  AdminChatMessageEditPage,
  AdminChatMessagesPage,
  AdminDiscardedChatMessagesPage,
  AdminChatRoomEditPage,
  AdminChatRoomsPage,
  AdminDiscardedChatRoomsPage,
  AdminNotificationsPage,
  AdminNotificationCreatePage,
  AdminNotificationEditPage,
  AdminProductCreatePage,
  AdminProductEditPage,
  AdminDiscardedProductsPage,
  AdminProductsPage,
  AdminRoleCreatePage,
  AdminRoleEditPage,
  AdminRolesPage,
  AdminDiscardedRolesPage,
  AdminUserCreatePage,
  AdminDiscardedUsersPage,
  AdminUserEditPage,
  AdminUsersPage,
  AdminAssetsPage,
  AdminDiscardedAssetsPage,
  AdminAssetCreatePage,
  AdminAssetEditPage,
} from "../modules/admin";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <>
          <AuthDialog />
          <Outlet />
        </>
      }
    >
      <Route path={AppRoutes.client.public.ROOT}>
        <Route index element={<RootPage />} />
        <Route
          path={AppRoutes.client.public.ANAPANA}
          element={<AnapanaRoute />}
        />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route
            path={AppRoutes.client.public.SIGN_IN}
            element={<SignInPage />}
          />
          <Route
            path={AppRoutes.client.public.SIGN_UP}
            element={<SignUpPage />}
          />
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
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path={AppRoutes.client.protected.HOME}
            element={<HomePage />}
          />
          <Route
            path={AppRoutes.client.protected.PROFILE}
            element={<UserPage />}
          />
          <Route
            path={AppRoutes.client.protected.SIGN_OUT}
            element={<SignOutPage />}
          />
          <Route
            path={AppRoutes.client.protected.PAYMENT}
            element={<PaymentPage />}
          />
          <Route
            path={AppRoutes.client.protected.PAYMENT_SUCCESS}
            element={<PaymentSuccessPage />}
          />
          <Route
            path={AppRoutes.client.protected.PAYMENT_CANCEL}
            element={<PaymentCancelPage />}
          />
          <Route path={AppRoutes.client.protected.AI} element={<AiPage />} />
          <Route
            path={AppRoutes.client.protected.admin.HOME}
            element={<AdminHomeRoute />}
          />
          <Route
            path={`${AppRoutes.client.protected.admin.HOME}/`}
            element={<AdminHomeRoute />}
          />
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.ANALYTICS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ANALYTICS}
              element={<AdminAnalyticsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.USERS}
                superAdminOnly
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.USERS}
              element={<AdminUsersPage />}
            />
            <Route
              path={AppRoutes.client.protected.admin.USERS_RECYCLE_BIN}
              element={<AdminDiscardedUsersPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.CREATE}
                resource={ADMIN_RESOURCES.USERS}
                superAdminOnly
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.USER_CREATE}
              element={<AdminUserCreatePage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.UPDATE}
                resource={ADMIN_RESOURCES.USERS}
                superAdminOnly
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.USER_EDIT}
              element={<AdminUserEditPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.ROLES}
                superAdminOnly
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ROLES}
              element={<AdminRolesPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.DELETE}
                resource={ADMIN_RESOURCES.ROLES}
                superAdminOnly
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ROLES_RECYCLE_BIN}
              element={<AdminDiscardedRolesPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.CREATE}
                resource={ADMIN_RESOURCES.ROLES}
                superAdminOnly
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ROLE_CREATE}
              element={<AdminRoleCreatePage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.UPDATE}
                resource={ADMIN_RESOURCES.ROLES}
                superAdminOnly
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ROLE_EDIT}
              element={<AdminRoleEditPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.ROOMS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.CHAT_ROOMS}
              element={<AdminChatRoomsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.DELETE}
                resource={ADMIN_RESOURCES.ROOMS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.CHAT_ROOMS_RECYCLE_BIN}
              element={<AdminDiscardedChatRoomsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.UPDATE}
                resource={ADMIN_RESOURCES.ROOMS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.CHAT_ROOM_EDIT}
              element={<AdminChatRoomEditPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.MESSAGES}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.CHAT_MESSAGES}
              element={<AdminChatMessagesPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.DELETE}
                resource={ADMIN_RESOURCES.MESSAGES}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.CHAT_MESSAGES_RECYCLE_BIN}
              element={<AdminDiscardedChatMessagesPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.UPDATE}
                resource={ADMIN_RESOURCES.MESSAGES}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.CHAT_MESSAGE_EDIT}
              element={<AdminChatMessageEditPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.NOTIFICATIONS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.NOTIFICATIONS}
              element={<AdminNotificationsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.CREATE}
                resource={ADMIN_RESOURCES.NOTIFICATIONS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.NOTIFICATION_CREATE}
              element={<AdminNotificationCreatePage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.UPDATE}
                resource={ADMIN_RESOURCES.NOTIFICATIONS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.NOTIFICATION_EDIT}
              element={<AdminNotificationEditPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.PRODUCTS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.PRODUCTS}
              element={<AdminProductsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.DELETE}
                resource={ADMIN_RESOURCES.PRODUCTS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.PRODUCTS_RECYCLE_BIN}
              element={<AdminDiscardedProductsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.CREATE}
                resource={ADMIN_RESOURCES.PRODUCTS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.PRODUCT_CREATE}
              element={<AdminProductCreatePage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.UPDATE}
                resource={ADMIN_RESOURCES.PRODUCTS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.PRODUCT_EDIT}
              element={<AdminProductEditPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.ACCESSES}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ACCESSES}
              element={<AdminAccessesPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.CREATE}
                resource={ADMIN_RESOURCES.ACCESSES}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ACCESS_CREATE}
              element={<AdminAccessCreatePage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.UPDATE}
                resource={ADMIN_RESOURCES.ACCESSES}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ACCESS_EDIT}
              element={<AdminAccessEditPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.FEEDBACKS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.FEEDBACK}
              element={<AdminFeedbacksPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.UPDATE}
                resource={ADMIN_RESOURCES.FEEDBACKS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.FEEDBACK_DETAIL}
              element={<AdminFeedbackDetailPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.CLIENTS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.LOGS}
              element={<AdminLogsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.CLIENTS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.LOG_DETAIL}
              element={<AdminLogDetailPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.DELETE}
                resource={ADMIN_RESOURCES.CLIENTS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.LOGS_RECYCLE_BIN}
              element={<AdminDiscardedLogsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.READ}
                resource={ADMIN_RESOURCES.ASSETS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ASSETS}
              element={<AdminAssetsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.DELETE}
                resource={ADMIN_RESOURCES.ASSETS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ASSETS_RECYCLE_BIN}
              element={<AdminDiscardedAssetsPage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.CREATE}
                resource={ADMIN_RESOURCES.ASSETS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ASSET_CREATE}
              element={<AdminAssetCreatePage />}
            />
          </Route>
          <Route
            element={
              <AdminRootRoute
                action={ADMIN_ACTIONS.UPDATE}
                resource={ADMIN_RESOURCES.ASSETS}
              />
            }
          >
            <Route
              path={AppRoutes.client.protected.admin.ASSET_EDIT}
              element={<AdminAssetEditPage />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <PageLayout>
              <NotFoundPage />
            </PageLayout>
          }
        />
      </Route>
    </Route>,
  ),
);

export const RouteManager = () => {
  return <RouterProvider router={router} />;
};
