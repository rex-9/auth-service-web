import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { Image, StatusBadge } from "../../../../design";
import { formatAdminDate } from "../../../../helpers";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import UserController from "../user.controller";
import type { IAdminUser } from "../types";

const loadUser = async (id: string) => {
  const result = await UserController.getUser(id);
  return { ...result, record: result.user };
};

export const AdminUserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: user, error } = useAdminDetail<IAdminUser>(id, loadUser);
  const listPath = AppRoutes.client.protected.admin.USERS;
  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Users.Title), to: listPath },
          { label: user?.name || t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={t(AppLocales.Admin.Users.Detail.Title)}
        description={t(AppLocales.Admin.Users.Detail.Description)}
        backTo={listPath}
      />
      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Users.Errors.LoadOneFailed)}
          message={error}
        />
      ) : user ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <AdminDetailSection
            title={t(AppLocales.Admin.Users.Detail.Identity)}
            icon={iconsLib.user}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-base-300 bg-base-200">
                <Image
                  src={user.avatar_url || ""}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-title-2 font-semibold">{user.name}</h2>
                <p className="text-base-content/60">@{user.username}</p>
              </div>
            </div>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Users.Detail.Account)}
            icon={iconsLib.document}
            className="lg:col-span-2"
          >
            <AdminDetailGrid>
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Email)}
                value={user.email}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Users.Detail.Provider)}
                value={user.provider}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Users.Detail.Confirmed)}
                value={
                  <StatusBadge
                    status={user.confirmed ? "confirmed" : "unconfirmed"}
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Users.Detail.Locked)}
                value={
                  <StatusBadge status={user.locked ? "locked" : "active"} />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={formatAdminDate(user.created_at)}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Updated)}
                value={formatAdminDate(user.updated_at)}
              />
            </AdminDetailGrid>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Users.Detail.Roles)}
            icon={iconsLib.key}
            className="lg:col-span-3"
          >
            <div className="flex flex-wrap gap-2">
              {user.iam?.roles.length ? (
                user.iam.roles.map((role) => (
                  <span
                    key={role.id}
                    className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 font-medium text-primary"
                  >
                    {role.attributes.name}
                  </span>
                ))
              ) : (
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Users.Detail.NoRoles)}
                </span>
              )}
            </div>
          </AdminDetailSection>
        </div>
      ) : null}
    </div>
  );
};
