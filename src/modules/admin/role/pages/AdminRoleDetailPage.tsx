import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { StatusBadge } from "../../../../design";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminPermissionMatrix,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import RoleController from "../role.controller";
import type { IAdminRole } from "../types";

const loadRole = async (id: string) => {
  const result = await RoleController.getRole(id);
  return { ...result, record: result.role };
};
export const AdminRoleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: role, error } = useAdminDetail<IAdminRole>(id, loadRole);
  const listPath = AppRoutes.client.protected.admin.ROLES;
  const permissions = Object.entries(role?.permissions ?? {}).flatMap(
    ([resource, actions]) =>
      actions.map((action) => ({
        id: `${resource}:${action}`,
        resource,
        action,
      })),
  );
  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Roles.Title), to: listPath },
          { label: role?.name || t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={t(AppLocales.Admin.Roles.Detail.Title)}
        description={t(AppLocales.Admin.Roles.Detail.Description)}
        backTo={listPath}
      />
      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Roles.Errors.LoadOne)}
          message={error}
        />
      ) : role ? (
        <div className="space-y-6">
          <AdminDetailSection
            title={t(AppLocales.Admin.Roles.Detail.Information)}
            icon={iconsLib.key}
          >
            <AdminDetailGrid>
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Name)}
                value={role.name}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Roles.Detail.Type)}
                value={
                  <StatusBadge status={role.system ? "system" : "custom"} />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Roles.Detail.AssignedUsers)}
                value={role.user_count ?? 0}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Description)}
                value={role.description}
                className="sm:col-span-2 xl:col-span-3"
              />
            </AdminDetailGrid>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Roles.Detail.Permissions)}
            icon={iconsLib.shieldCheck}
          >
            {permissions.length ? (
              <AdminPermissionMatrix permissions={permissions} />
            ) : (
              <span className="text-base-content/60">
                {t(AppLocales.Admin.Roles.Detail.NoPermissions)}
              </span>
            )}
          </AdminDetailSection>
        </div>
      ) : null}
    </div>
  );
};
