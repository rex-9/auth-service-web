import React from "react";
import { StatusBadge, TextLink } from "../../../../design";
import { AppLocales, useTranslate } from "../../../../locales";
import type { IChildAsset } from "../../../../models";
import { formatAssetFileSize } from "../constants";

interface IAdminAssetSubtitleValueProps {
  subtitle?: IChildAsset | null;
}

export const AdminAssetSubtitleValue: React.FC<
  IAdminAssetSubtitleValueProps
> = ({ subtitle }) => {
  const t = useTranslate();

  if (!subtitle?.url) return "—";

  return (
    <span className="inline-flex flex-wrap items-center justify-end gap-2">
      <StatusBadge status={subtitle.status} />
      {subtitle.size_bytes != null && subtitle.size_bytes > 0 && (
        <span className="text-body-s font-medium text-base-content">
          {formatAssetFileSize(subtitle.size_bytes)}
        </span>
      )}
      <TextLink href={subtitle.url} external>
        {t(AppLocales.Admin.Assets.Subtitle.View)}
      </TextLink>
    </span>
  );
};
