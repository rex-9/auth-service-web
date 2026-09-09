import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { StatusBadge } from "../../../../design";
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
import AccessController from "../access.controller";
import type { IAdminAccess } from "../types";

const loadAccess = async (id: string) => {
  const result = await AccessController.getAccess(id);
  return { ...result, record: result.access };
};
export const AdminAccessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: access, error } = useAdminDetail<IAdminAccess>(
    id,
    loadAccess,
  );
  const listPath = AppRoutes.client.protected.admin.ACCESSES;
  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          { label: t(AppLocales.Admin.Common.Detail.Admin), to: AppRoutes.client.protected.admin.HOME },
          { label: t(AppLocales.Admin.Accesses.Title), to: listPath },
          { label: access?.user_name || access?.user_email || t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={t(AppLocales.Admin.Accesses.Detail.Title)}
        description={t(AppLocales.Admin.Accesses.Detail.Description)}
        backTo={listPath}
      />
      {error ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : access ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminDetailSection title={t(AppLocales.Admin.Accesses.Detail.Holder)} icon={iconsLib.user}>
            <AdminDetailGrid className="xl:grid-cols-2">
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Name)}
                value={access.user_name || access.username}
              />
              <AdminDetailField label={t(AppLocales.Admin.Common.Detail.Email)} value={access.user_email} />
              <AdminDetailField
                label={t(AppLocales.Admin.Accesses.Detail.UserId)}
                value={access.user_id}
                className="sm:col-span-2"
              />
            </AdminDetailGrid>
          </AdminDetailSection>
          <AdminDetailSection title={t(AppLocales.Admin.Accesses.Detail.Entitlement)} icon={iconsLib.shieldCheck}>
            <AdminDetailGrid className="xl:grid-cols-2">
              <AdminDetailField
                label={t(AppLocales.Admin.Products.Detail.Product)}
                value={access.product_name || access.product_code}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Status)}
                value={<StatusBadge status={access.status} />}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Accesses.Detail.Granted)}
                value={
                  access.granted_at ? formatAdminDate(access.granted_at) : "—"
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Accesses.Detail.Expires)}
                value={
                  access.expires_at
                    ? formatAdminDate(access.expires_at)
                    : t(AppLocales.Admin.Accesses.Detail.Never)
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Accesses.Detail.RemainingDays)}
                value={access.remaining_days}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Updated)}
                value={formatAdminDate(access.updated_at)}
              />
            </AdminDetailGrid>
          </AdminDetailSection>
        </div>
      ) : null}
    </div>
  );
};
