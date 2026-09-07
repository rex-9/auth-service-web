import React, { useCallback, useEffect, useState } from "react";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  Button,
  ButtonSizes,
  ButtonVariants,
  MetricIndicators,
  MetricOverviewCard,
  ProgressBar,
  SegmentedProgressBar,
} from "../../../../design";
import {
  ProgressBarSizes,
  ProgressBarVariants,
} from "../../../../design/constants";
import { AppLocales, useTranslate } from "../../../../locales";
import { formatAssetFileSize, STORAGE_PARTITION_VALUES } from "../constants";
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
    // Initial remote synchronization intentionally drives this component's loading state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
          <iconsLib.warning className="w-5 h-5 shrink-0" />
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
  const partitions = STORAGE_PARTITION_VALUES.map((name) => ({
    name,
    bytes: stats.partitions?.[name]?.bytes ?? 0,
    objects: stats.partitions?.[name]?.objects ?? 0,
  }));
  const trackedPartitions = STORAGE_PARTITION_VALUES.map((name) => ({
    name,
    bytes: stats.tracked_partitions?.[name]?.bytes ?? 0,
    objects: stats.tracked_partitions?.[name]?.objects ?? 0,
  }));
  const partitionColors = ["bg-info", "bg-warning", "bg-success"];

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

      <MetricOverviewCard
        sections={[
          {
            key: "storage",
            content: (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-body-s font-medium text-base-content/70">
                      {t(AppLocales.Admin.Assets.StorageStats.Occupied)}
                    </div>
                    <div className="mt-2 text-heading-m font-bold">
                      {formatAssetFileSize(stats.bucket_bytes)}
                    </div>
                  </div>
                  <iconsLib.archiveBox className="h-5 w-5 text-primary" />
                </div>
                <SegmentedProgressBar
                  ariaLabel={t(AppLocales.Admin.Assets.StorageStats.PartitionsTitle)}
                  items={partitions.map((partition, index) => ({
                    label: partition.name,
                    value: partition.bytes,
                    className: partitionColors[index],
                  }))}
                />
                <MetricIndicators
                  items={[
                    {
                      label: t(AppLocales.Admin.Assets.StorageStats.Total),
                      value: formatAssetFileSize(stats.bucket_bytes),
                      detail: `${stats.bucket_objects ?? 0} ${t(AppLocales.Admin.Assets.StorageStats.Objects)}`,
                    },
                    ...partitions.map((partition) => ({
                      label: `${partition.name}/`,
                      value: formatAssetFileSize(partition.bytes),
                      detail: `${partition.objects.toLocaleString()} ${t(AppLocales.Admin.Assets.StorageStats.Objects)}`,
                    })),
                  ]}
                />
              </div>
            ),
          },
          {
            key: "disk",
            content: (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-body-s font-medium text-base-content/70">
                      {t(AppLocales.Admin.Assets.StorageStats.VpsDisk)}
                    </div>
                    <div className="mt-2 text-heading-m font-bold">
                      {hasDiskData
                        ? `${stats.disk_free_percent ?? 0}% ${t(AppLocales.Admin.Assets.StorageStats.VpsAvailable)}`
                        : "N/A"}
                    </div>
                  </div>
                  <iconsLib.cube className="h-5 w-5 text-primary" />
                </div>
                {hasDiskData && (
                  <ProgressBar
                    value={stats.disk_used_percent || 0}
                    size={ProgressBarSizes.SM}
                    variant={progressVariant}
                  />
                )}
                <MetricIndicators
                  items={[
                    {
                      label: t(AppLocales.Admin.Assets.StorageStats.VpsUsed),
                      value: `${stats.disk_used_percent ?? 0}%`,
                      detail: formatAssetFileSize(
                        (stats.disk_total_bytes ?? 0) -
                          (stats.disk_available_bytes ?? 0),
                      ),
                    },
                    {
                      label: t(AppLocales.Admin.Assets.StorageStats.VpsAvailable),
                      value: `${stats.disk_free_percent ?? 0}%`,
                      detail: formatAssetFileSize(stats.disk_available_bytes),
                    },
                    {
                      label: t(AppLocales.Admin.Assets.StorageStats.VpsTotal),
                      value: formatAssetFileSize(stats.disk_total_bytes),
                      detail: stats.node_capacity_bytes
                        ? `${t(AppLocales.Admin.Assets.StorageStats.NodeCapacity)} ${formatAssetFileSize(stats.node_capacity_bytes)}`
                        : undefined,
                    },
                  ]}
                />
              </div>
            ),
          },
          {
            key: "tracked",
            content: (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-body-s font-medium text-base-content/70">
                      {t(AppLocales.Admin.Assets.StorageStats.DbAssets)}
                    </div>
                    <div className="mt-2 text-heading-m font-bold">
                      {stats.db_assets_count.toLocaleString()}
                    </div>
                  </div>
                  <span className="rounded bg-success/10 px-2 py-1 text-caption font-semibold text-success">
                    {providerLabel} · {t(AppLocales.Admin.Assets.StorageStats.Online)}
                  </span>
                </div>
                <SegmentedProgressBar
                  ariaLabel={t(
                    AppLocales.Admin.Assets.StorageStats.TrackedPartitions,
                  )}
                  items={trackedPartitions.map((partition, index) => ({
                    label: partition.name,
                    value: partition.objects,
                    className: partitionColors[index],
                  }))}
                />
                <MetricIndicators
                  items={[
                    {
                      label: t(AppLocales.Admin.Assets.StorageStats.Total),
                      value: `${stats.db_assets_count.toLocaleString()} ${t(AppLocales.Admin.Assets.StorageStats.Objects)}`,
                      detail: formatAssetFileSize(stats.db_assets_bytes),
                    },
                    ...trackedPartitions.map((partition) => ({
                      label: `${partition.name}/`,
                      value: `${partition.objects.toLocaleString()} ${t(AppLocales.Admin.Assets.StorageStats.Objects)}`,
                      detail: formatAssetFileSize(partition.bytes),
                    })),
                  ]}
                />
              </div>
            ),
          },
        ]}
      />

      {/* Critical Low Disk Warning if free space < 15% */}
      {isLowDisk && (
        <div className="rounded-md border border-warning/30 bg-warning/10 p-3.5 flex items-center gap-2.5 text-warning text-caption">
          <iconsLib.warning className="w-5 h-5 shrink-0" />
          <span>{t(AppLocales.Admin.Assets.StorageStats.VpsLowWarning)}</span>
        </div>
      )}
    </div>
  );
};

export default AdminAssetStorageStats;
