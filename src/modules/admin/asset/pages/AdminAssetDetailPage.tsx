import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { Image, StatusBadge } from "../../../../design";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import AssetController from "../asset.controller";
import { formatAssetFileSize } from "../constants";
import type { IAdminAsset } from "../types";

const loadAsset = async (id: string) => {
  const result = await AssetController.getAsset(id);
  return { ...result, record: result.asset };
};
export const AdminAssetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: asset, error } = useAdminDetail<IAdminAsset>(id, loadAsset);
  const listPath = AppRoutes.client.protected.admin.ASSETS;
  const preview =
    asset?.format?.toLowerCase() === "image"
      ? asset.url
      : asset?.thumbnail?.url;
  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          { label: t(AppLocales.Admin.Common.Detail.Admin), to: AppRoutes.client.protected.admin.HOME },
          { label: t(AppLocales.Admin.Assets.Title), to: listPath },
          { label: asset?.name || t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={t(AppLocales.Admin.Assets.Detail.Title)}
        description={t(AppLocales.Admin.Assets.Detail.Description)}
        backTo={listPath}
      />
      {error ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : asset ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <AdminDetailSection title={t(AppLocales.Admin.Assets.Detail.Preview)} icon={iconsLib.photo}>
            {preview ? (
              <Image
                src={preview}
                alt={asset.name}
                className="max-h-80 w-full rounded-lg object-contain"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg bg-base-200">
                <iconsLib.photo className="h-12 w-12 text-base-content/30" />
              </div>
            )}
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Assets.Detail.Metadata)}
            icon={iconsLib.document}
            className="lg:col-span-2"
          >
            <AdminDetailGrid>
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Name)}
                value={asset.name}
                className="sm:col-span-2 xl:col-span-3"
              />
              <AdminDetailField label={t(AppLocales.Admin.Common.Detail.Type)} value={asset.type} />
              <AdminDetailField label={t(AppLocales.Admin.Common.Detail.Format)} value={asset.format} />
              <AdminDetailField
                label={t(AppLocales.Admin.Assets.Detail.Status)}
                value={<StatusBadge status={asset.status || "unknown"} />}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Size)}
                value={formatAssetFileSize(asset.size_bytes)}
              />
              <AdminDetailField label={t(AppLocales.Admin.Common.Detail.Source)} value={asset.source} />
              <AdminDetailField
                label={t(AppLocales.Admin.Assets.Detail.Duration)}
                value={
                  asset.duration_secs ? `${asset.duration_secs}s` : undefined
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Assets.Detail.StorageKey)}
                value={asset.storage_key}
                className="sm:col-span-2 xl:col-span-3"
              />
            </AdminDetailGrid>
          </AdminDetailSection>
        </div>
      ) : null}
    </div>
  );
};
