import React, { useCallback, useEffect, useState } from "react";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  Button,
  ButtonSizes,
  ButtonVariants,
  ProgressBar,
} from "../../../../design";
import {
  ProgressBarSizes,
  ProgressBarVariants,
} from "../../../../design/constants";
import { AppLocales, useTranslate } from "../../../../locales";
import { AdminKpiCard } from "../../components";
import { formatAssetFileSize } from "../constants";
import type { IStorageStats } from "../types";
import { Admin } from "../..";

interface IAdminAssetStorageStatsProps {
  className?: string;
}

export const AdminAssetStorageStats: React.FC<IAdminAssetStorageStatsProps> = ({
  className = "",
}) => {
  const t = useTranslate();
  const [stats, setStats] = useState<IStorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const result = await Admin.AssetController.getStorageStats();
    if (result.success && result.stats) {
      setStats(result.stats);
    } else {
      setError(result.error || "Failed to load storage statistics");
    }

    setLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 animate-pulse rounded bg-base-300" />
          <div className="h-8 w-24 animate-pulse rounded bg-base-300" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-md border border-base-300 bg-base-100 p-4"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div
        className={`rounded-md border border-error/30 bg-base-100 p-4 flex items-center justify-between shadow-sm ${className}`}
      >
        <div className="flex items-center gap-2 text-error text-body-s">
          <iconsLib.warning className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
        <Button
          size={ButtonSizes.SM}
          variant={ButtonVariants.TERTIARY}
          onClick={() => fetchStats(true)}
        >
          <iconsLib.arrowPath className="w-4 h-4 mr-1" />
          {t(AppLocales.Common.Submit)}
        </Button>
      </div>
    );
  }

  if (!stats) return null;

  const hasDiskData =
    typeof stats.disk_total_bytes === "number" && stats.disk_total_bytes > 0;
  const isLowDisk =
    hasDiskData &&
    typeof stats.disk_free_percent === "number" &&
    stats.disk_free_percent < 15;
  const progressVariant = isLowDisk
    ? ProgressBarVariants.WARNING
    : ProgressBarVariants.PRIMARY;

  const providerLabel =
    stats.provider === "garage" ? "Garage S3" : stats.provider.toUpperCase();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-body-m text-base-content leading-tight">
            {t(AppLocales.Admin.Assets.StorageStats.Title)}
          </h3>
          <Badge variant="primary" className="text-xs px-2 py-0.5">
            {providerLabel}
          </Badge>
          {stats.bucket && (
            <span className="font-mono text-xs opacity-60">
              ({stats.bucket})
            </span>
          )}
        </div>

        <Button
          size={ButtonSizes.SM}
          variant={ButtonVariants.TERTIARY}
          onClick={() => fetchStats(true)}
          disabled={isRefreshing}
          className="text-xs text-base-content/70 hover:text-base-content"
          title={t(AppLocales.Admin.Assets.StorageStats.Refresh)}
        >
          <iconsLib.arrowPath
            className={`w-4 h-4 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing
            ? t(AppLocales.Admin.Assets.StorageStats.Refreshing)
            : t(AppLocales.Admin.Assets.StorageStats.Refresh)}
        </Button>
      </div>

      {/* Main KPI Cards Grid (4-Column Layout matching Analytics Page) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Garage Storage Occupied */}
        <AdminKpiCard
          title={t(AppLocales.Admin.Assets.StorageStats.Occupied)}
          value={formatAssetFileSize(stats.bucket_bytes)}
          icon={iconsLib.archiveBox}
          subtitle={`${stats.bucket_objects ?? 0} ${t(AppLocales.Admin.Assets.StorageStats.Objects)} stored in ${stats.bucket || "bucket"}`}
        />

        {/* Card 2: VPS Host Disk Space */}
        <AdminKpiCard
          title={t(AppLocales.Admin.Assets.StorageStats.VpsDisk)}
          value={
            hasDiskData
              ? `${stats.disk_free_percent ?? 0}% ${t(AppLocales.Admin.Assets.StorageStats.VpsAvailable)}`
              : "N/A"
          }
          icon={iconsLib.cube}
          iconClassName={
            isLowDisk
              ? "text-warning bg-warning/10"
              : "text-primary bg-base-200"
          }
          extra={
            hasDiskData ? (
              <ProgressBar
                value={stats.disk_used_percent || 0}
                size={ProgressBarSizes.SM}
                variant={progressVariant}
              />
            ) : undefined
          }
          subtitle={
            hasDiskData
              ? `${formatAssetFileSize(stats.disk_available_bytes)} ${t(AppLocales.Admin.Assets.StorageStats.VpsAvailable).toLowerCase()} / ${formatAssetFileSize(stats.disk_total_bytes)} ${t(AppLocales.Admin.Assets.StorageStats.VpsTotal).toLowerCase()}`
              : stats.provider === "garage"
                ? "Host disk unmetered"
                : "Unmetered / Cloud"
          }
        />

        {/* Card 3: Tracked Assets in DB */}
        <AdminKpiCard
          title={t(AppLocales.Admin.Assets.StorageStats.DbAssets)}
          value={stats.db_assets_count.toLocaleString()}
          icon={iconsLib.document}
          subtitle={`${formatAssetFileSize(stats.db_assets_bytes)} tracked in database`}
        />

        {/* Card 4: Cluster Health / Provider Status */}
        <AdminKpiCard
          title={t(AppLocales.Admin.Assets.StorageStats.Provider)}
          value={providerLabel}
          icon={iconsLib.check}
          iconClassName="text-emerald-500 bg-emerald-500/10"
          badge={
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-caption font-semibold text-emerald-500">
              Online
            </span>
          }
          subtitle={
            stats.node_capacity_bytes && stats.node_capacity_bytes > 0
              ? `Capacity: ${formatAssetFileSize(stats.node_capacity_bytes)}`
              : "Active & Connected"
          }
        />
      </div>

      {/* Critical Low Disk Warning if free space < 15% */}
      {isLowDisk && (
        <div className="rounded-md border border-warning/30 bg-warning/10 p-3.5 flex items-center gap-2.5 text-warning text-caption">
          <iconsLib.warning className="w-5 h-5 flex-shrink-0" />
          <span>{t(AppLocales.Admin.Assets.StorageStats.VpsLowWarning)}</span>
        </div>
      )}
    </div>
  );
};

export default AdminAssetStorageStats;
