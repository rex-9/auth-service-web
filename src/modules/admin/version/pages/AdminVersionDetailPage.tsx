import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { StatusBadge } from "../../../../design";
import { DateTime, DateTimeFormats } from "../../../../design";
import { AppLocales, useTranslate } from "../../../../locales";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import type { IAdminVersion } from "../types";
import VersionController from "../version.controller";
import { AdminUserVersionsPage } from "./AdminUserVersionsPage";

const loadVersion = async (id: string) => {
  const result = await VersionController.getVersion(id);
  return { ...result, record: result.version };
};

export const AdminVersionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: version, error } = useAdminDetail<IAdminVersion>(
    id,
    loadVersion,
  );
  const listPath = AppRoutes.client.protected.admin.VERSIONS;

  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Versions.Title), to: listPath },
          {
            label:
              version?.number || t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={t(AppLocales.Admin.Versions.Detail.Title)}
        description={t(AppLocales.Admin.Versions.Detail.Description)}
        backTo={listPath}
      />

      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Versions.Errors.LoadOne)}
          message={error}
        />
      ) : version ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <AdminDetailSection
              title={t(AppLocales.Admin.Versions.Detail.Release)}
              icon={iconsLib.tag}
            >
              <AdminDetailGrid className="xl:grid-cols-2">
                <AdminDetailField
                  label={t(AppLocales.Admin.Versions.Detail.VersionNumber)}
                  value={version.number}
                />
                <AdminDetailField
                  label={t(AppLocales.Admin.Common.Detail.Status)}
                  value={<StatusBadge status={version.status} />}
                />
                <AdminDetailField
                  label={t(AppLocales.Admin.Versions.Table.Title)}
                  value={version.title}
                />
                <AdminDetailField
                  label={t(AppLocales.Admin.Versions.Detail.ForceUpdate)}
                  value={
                    <StatusBadge
                      status={version.is_force_update ? "enabled" : "disabled"}
                    />
                  }
                />
                <AdminDetailField
                  label={t(AppLocales.Admin.Common.Detail.Description)}
                  value={version.description}
                  className="sm:col-span-2"
                />
              </AdminDetailGrid>
            </AdminDetailSection>

            <AdminDetailSection
              title={t(AppLocales.Admin.Versions.Detail.Builds)}
              icon={iconsLib.devicePhoneMobile}
            >
              <AdminDetailGrid className="xl:grid-cols-2">
                <AdminDetailField
                  label={t(AppLocales.Admin.Versions.Detail.IosBuild)}
                  value={version.ios_build_number}
                />
                <AdminDetailField
                  label={t(AppLocales.Admin.Versions.Detail.AndroidBuild)}
                  value={version.android_build_number}
                />
                <AdminDetailField
                  label={t(AppLocales.Admin.Versions.Detail.Released)}
                  value={
                    <DateTime
                      value={version.released_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  }
                />
                <AdminDetailField
                  label={t(AppLocales.Admin.Common.Detail.Created)}
                  value={
                    <DateTime
                      value={version.created_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  }
                />
                <AdminDetailField
                  label={t(AppLocales.Admin.Common.Detail.Updated)}
                  value={
                    <DateTime
                      value={version.updated_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  }
                />
                <AdminDetailField
                  label={t(AppLocales.Admin.Versions.Table.Installs)}
                  value={version.install_count ?? 0}
                />
              </AdminDetailGrid>
            </AdminDetailSection>
          </div>

          <AdminDetailSection
            title={t(AppLocales.Admin.Versions.Detail.Installs)}
            icon={iconsLib.user}
            contentClassName="space-y-6"
          >
            <AdminUserVersionsPage embedded />
          </AdminDetailSection>
        </>
      ) : null}
    </div>
  );
};
