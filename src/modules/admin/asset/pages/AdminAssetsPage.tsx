import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, useSort, SORT_ORDERS } from "../../../../hooks";
import type { IApiPagination, IAsset } from "../../../../models";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  Button,
  SearchInput,
  Dropdown,
  Tabs,
  Image,
  StatusBadge,
  ButtonSizes,
  ButtonVariants,
} from "../../../../design";
import { AppLocales, useTranslate } from "../../../../locales";
import type { IAdminAsset } from "../types";
import SocketService, {
  ISocketMessage,
} from "../../../../services/socket.service";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  AdminEmptyRecycleBinButton,
  AdminBatchActionBar,
  ConfirmDialog,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_ACTIONS,
  ADMIN_VIEW_MODES,
  ADMIN_RESOURCES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_ASSET_COLUMNS,
  ASSET_TYPE_OPTIONS,
  ASSET_FORMAT_OPTIONS,
  ASSET_STATUSES,
  ASSET_STATUS_OPTIONS,
  formatAssetFileSize,
  isImageAsset,
} from "../constants";
import { formatAdminDate } from "../../../../helpers";
import { usePermissions } from "../../../../hooks/usePermissions";
import { AdminAssetStorageStats } from "../components";
import { Admin } from "../..";

interface IAdminAssetsPageProps {
  view?: TAdminViewMode;
}

export const AdminAssetsPage: React.FC<IAdminAssetsPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  const isActive = view === ADMIN_VIEW_MODES.ACTIVE;
  const t = useTranslate();

  useDocumentTitle(
    isActive
      ? `${t(AppLocales.Admin.Assets.Title)} | Admin`
      : `${t(AppLocales.Admin.Assets.RecycleTitle)} | Admin`,
  );

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { can } = usePermissions();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "";
  const formatFilter = searchParams.get("format") || "";
  const statusFilter = searchParams.get("status") || "";

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: isActive
      ? ADMIN_ASSET_COLUMNS.CREATED_AT
      : ADMIN_ASSET_COLUMNS.DISCARDED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { isLoading, setLoading } = useLoading();
  const toast = useToast();

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [assets, setAssets] = useState<IAdminAsset[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);

  // Active view state
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [assetToDiscard, setAssetToDiscard] = useState<IAdminAsset | null>(
    null,
  );
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [compressingId, setCompressingId] = useState<string | null>(null);
  const pendingSocketUpdates = useRef<
    Map<string, { status: string; size_bytes?: number; url?: string }>
  >(new Map());

  // Discarded view state
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [assetToRestore, setAssetToRestore] = useState<IAdminAsset | null>(
    null,
  );
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDestroyOpen, setIsDestroyOpen] = useState(false);
  const [assetToDestroy, setAssetToDestroy] = useState<IAdminAsset | null>(
    null,
  );
  const [isDestroying, setIsDestroying] = useState(false);

  // Selection & Batch state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchDiscardOpen, setIsBatchDiscardOpen] = useState(false);
  const [isBatchDiscarding, setIsBatchDiscarding] = useState(false);
  const [isBatchRestoreOpen, setIsBatchRestoreOpen] = useState(false);
  const [isBatchRestoring, setIsBatchRestoring] = useState(false);
  const [isBatchDestroyOpen, setIsBatchDestroyOpen] = useState(false);
  const [isBatchDestroying, setIsBatchDestroying] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: ADMIN_PAGE_SIZE,
      };

      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.sort_order = sortOrder;
      if (searchQuery) params.search = searchQuery;
      if (typeFilter) params.type = typeFilter;
      if (formatFilter) params.format = formatFilter;
      if (statusFilter) params.status = statusFilter;

      const result = isActive
        ? await Admin.AssetController.getAssets(params)
        : await Admin.AssetController.getDiscardedAssets(params);

      if (result.success) {
        setAssets(result.assets);
        setPagination(result.pagination);
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.LoadFailed),
        );
      }
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  }, [
    page,
    sortBy,
    sortOrder,
    searchQuery,
    typeFilter,
    formatFilter,
    statusFilter,
    isActive,
    setLoading,
    toast,
    t,
  ]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    const handleSocketMessage = (event: ISocketMessage) => {
      if (event.type !== "notification") return;
      const eventType =
        typeof event.data?.type === "string" ? event.data.type : "";
      if (
        eventType !== "asset_compressed" &&
        eventType !== "asset_compression_failed" &&
        eventType !== "asset_compressing"
      ) {
        return;
      }

      const assetId =
        typeof event.data?.asset_id === "string" ? event.data.asset_id : "";
      if (!assetId) return;

      const status =
        typeof event.data?.status === "string" ? event.data.status : "";
      const sizeBytes =
        typeof event.data?.size_bytes === "number"
          ? event.data.size_bytes
          : undefined;
      const url =
        typeof event.data?.url === "string" ? event.data.url : undefined;

      setAssets((prevAssets) => {
        let matched = false;
        const next = prevAssets.map((a) => {
          if (a.id === assetId) {
            matched = true;
            return {
              ...a,
              status: (status as IAsset["status"]) || a.status,
              size_bytes: sizeBytes !== undefined ? sizeBytes : a.size_bytes,
              url: url !== undefined ? url : a.url,
            };
          }
          return a;
        });

        if (!matched) {
          pendingSocketUpdates.current.set(assetId, {
            status,
            size_bytes: sizeBytes,
            url,
          });
          return prevAssets;
        }

        return next;
      });
    };

    SocketService.addListener(handleSocketMessage);
    return () => {
      SocketService.removeListener(handleSocketMessage);
    };
  }, []);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSelectedIds([]);
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams({ search: e.target.value || null, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
  };

  // Active view actions
  const handleDiscard = async () => {
    if (!assetToDiscard) return;

    setIsDiscarding(true);
    try {
      const result = await Admin.AssetController.discardAsset(
        assetToDiscard.id,
      );
      if (result.success) {
        toast.success(
          result.message || t(AppLocales.Admin.Assets.Toasts.DiscardSuccess),
        );
        setIsDiscardOpen(false);
        setAssetToDiscard(null);
        fetchAssets();
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.DiscardFailed),
        );
      }
    } finally {
      setIsDiscarding(false);
    }
  };

  // Discarded view actions
  const handleRestore = async () => {
    if (!assetToRestore) return;

    setIsRestoring(true);
    try {
      const result = await Admin.AssetController.undiscardAsset(
        assetToRestore.id,
      );
      if (result.success) {
        toast.success(
          result.message || t(AppLocales.Admin.Assets.Toasts.RestoreSuccess),
        );
        setIsRestoreOpen(false);
        setAssetToRestore(null);
        fetchAssets();
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.RestoreFailed),
        );
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDestroy = async () => {
    if (!assetToDestroy) return;

    setIsDestroying(true);
    try {
      const result = await Admin.AssetController.destroyAsset(
        assetToDestroy.id,
      );
      if (result.success) {
        toast.success(
          result.message || t(AppLocales.Admin.Assets.Toasts.DestroySuccess),
        );
        setIsDestroyOpen(false);
        setAssetToDestroy(null);
        fetchAssets();
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.DestroyFailed),
        );
      }
    } finally {
      setIsDestroying(false);
    }
  };

  const canCreate = can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.ASSETS);
  const canUpdate = can(ADMIN_ACTIONS.UPDATE, ADMIN_RESOURCES.ASSETS);
  const canDelete = can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.ASSETS);

  const handleBatchDiscard = async () => {
    if (selectedIds.length === 0) return;
    setIsBatchDiscarding(true);
    try {
      const result = await Admin.AssetController.discardBatch(selectedIds);
      if (result.success) {
        toast.success(
          result.message ||
            t(AppLocales.Admin.Assets.Toasts.BatchDiscardSuccess, {
              count: String(result.count ?? selectedIds.length),
            }),
        );
        setIsBatchDiscardOpen(false);
        setSelectedIds([]);
        fetchAssets();
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.DiscardFailed),
        );
      }
    } finally {
      setIsBatchDiscarding(false);
    }
  };

  const handleBatchRestore = async () => {
    if (selectedIds.length === 0) return;
    setIsBatchRestoring(true);
    try {
      const result = await Admin.AssetController.undiscardBatch(selectedIds);
      if (result.success) {
        toast.success(
          result.message ||
            t(AppLocales.Admin.Assets.Toasts.BatchRestoreSuccess, {
              count: String(result.count ?? selectedIds.length),
            }),
        );
        setIsBatchRestoreOpen(false);
        setSelectedIds([]);
        fetchAssets();
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.RestoreFailed),
        );
      }
    } finally {
      setIsBatchRestoring(false);
    }
  };

  const handleBatchDestroy = async () => {
    if (selectedIds.length === 0) return;
    setIsBatchDestroying(true);
    try {
      const result = await Admin.AssetController.destroyBatch(selectedIds);
      if (result.success) {
        toast.success(
          result.message ||
            t(AppLocales.Admin.Assets.Toasts.BatchDestroySuccess, {
              count: String(result.count ?? selectedIds.length),
            }),
        );
        setIsBatchDestroyOpen(false);
        setSelectedIds([]);
        fetchAssets();
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.DestroyFailed),
        );
      }
    } finally {
      setIsBatchDestroying(false);
    }
  };

  const handleEmptyRecycleBin = async () => {
    const result = await Admin.AssetController.emptyRecycleBin();
    if (result.success) {
      toast.success(
        result.message || t(AppLocales.Admin.Assets.Toasts.RecycleBinEmptied),
      );
      setSelectedIds([]);
      fetchAssets();
    } else {
      toast.error(
        result.error || t(AppLocales.Admin.Assets.Errors.DestroyFailed),
      );
    }
  };

  const batchActions = useMemo(() => {
    if (isActive) {
      return [
        {
          key: "batch-discard",
          label: t(AppLocales.Admin.Common.Batch.DiscardSelected),
          icon: iconsLib.trash,
          isDestructive: true,
          onClick: () => setIsBatchDiscardOpen(true),
        },
      ];
    }
    return [
      {
        key: "batch-restore",
        label: t(AppLocales.Admin.Common.Batch.RestoreSelected),
        icon: iconsLib.arrowPath,
        variant: ButtonVariants.SECONDARY,
        onClick: () => setIsBatchRestoreOpen(true),
      },
      {
        key: "batch-destroy",
        label: t(AppLocales.Admin.Common.Batch.DestroySelected),
        icon: iconsLib.trash,
        isDestructive: true,
        onClick: () => setIsBatchDestroyOpen(true),
      },
    ];
  }, [isActive, t]);

  const handleCompress = async (asset: IAdminAsset) => {
    setCompressingId(asset.id);
    try {
      const result = await Admin.AssetController.compressAsset(asset.id);
      if (result.success) {
        toast.info(result.message || "Compression enqueued successfully");
        setAssets((prevAssets) =>
          prevAssets.map((a) =>
            a.id === asset.id ? { ...a, status: ASSET_STATUSES.PROCESSING } : a,
          ),
        );
      } else if (result.isOptimal) {
        toast.info(
          result.error || t(AppLocales.Admin.Assets.Compression.AtMinSize),
        );
        setAssets((prevAssets) =>
          prevAssets.map((a) =>
            a.id === asset.id ? { ...a, status: ASSET_STATUSES.OPTIMAL } : a,
          ),
        );
      } else {
        toast.error(result.error || "Failed to trigger compression");
      }
    } finally {
      setCompressingId(null);
    }
  };

  const columns: IAdminTableColumn<IAdminAsset>[] = useMemo(() => {
    const base: IAdminTableColumn<IAdminAsset>[] = [
      {
        key: ADMIN_ASSET_COLUMNS.PREVIEW,
        header: t(AppLocales.Admin.Assets.Table.Preview),
        className: "w-14",
        render: (asset) => {
          const isImg = isImageAsset(asset);

          return (
            <div className="w-10 h-10 rounded overflow-hidden bg-base-200 flex items-center justify-center">
              {isImg ? (
                <Image
                  src={asset.url}
                  alt={asset.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover ${!isActive ? "opacity-50 grayscale" : ""}`}
                  fallback={
                    <iconsLib.photo className="w-5 h-5 text-base-content/50" />
                  }
                />
              ) : (
                <iconsLib.photo className="w-5 h-5 text-base-content/50" />
              )}
            </div>
          );
        },
      },
      {
        key: ADMIN_ASSET_COLUMNS.NAME,
        header: t(AppLocales.Admin.Assets.Table.Name),
        sortKey: ADMIN_ASSET_COLUMNS.NAME,
        className: "w-56 max-w-[220px] sm:max-w-[260px]",
        render: (asset) => (
          <div className="flex flex-col min-w-0 max-w-[220px] sm:max-w-[260px]">
            <span
              className="font-medium text-base-content truncate"
              title={asset.name}
            >
              {asset.name}
            </span>
            <span
              className="text-xs text-base-content/60 font-mono truncate"
              title={asset.id}
            >
              {asset.id}
            </span>
          </div>
        ),
      },
      {
        key: ADMIN_ASSET_COLUMNS.TYPE,
        header: t(AppLocales.Admin.Assets.Table.Type),
        sortKey: ADMIN_ASSET_COLUMNS.TYPE,
        render: (asset) => <Badge>{asset.type}</Badge>,
      },
    ];

    if (isActive) {
      base.push(
        {
          key: ADMIN_ASSET_COLUMNS.FORMAT,
          header: t(AppLocales.Admin.Assets.Table.Format),
          sortKey: ADMIN_ASSET_COLUMNS.FORMAT,
          render: (asset) => (
            <span className="text-sm uppercase">{asset.format || "N/A"}</span>
          ),
        },
        {
          key: ADMIN_ASSET_COLUMNS.STATUS,
          header: "Status",
          sortKey: ADMIN_ASSET_COLUMNS.STATUS,
          render: (asset) => <StatusBadge status={asset.status || "pending"} />,
        },
        {
          key: ADMIN_ASSET_COLUMNS.SIZE,
          header: t(AppLocales.Admin.Assets.Table.Size),
          sortKey: ADMIN_ASSET_COLUMNS.SIZE,
          render: (asset) => (
            <span className="text-sm">
              {formatAssetFileSize(asset.size_bytes)}
            </span>
          ),
        },
        {
          key: ADMIN_ASSET_COLUMNS.CREATED_AT,
          header: t(AppLocales.Admin.Assets.Table.Created),
          sortKey: ADMIN_ASSET_COLUMNS.CREATED_AT,
          className: "text-center",
          render: (asset) => formatAdminDate(asset.created_at),
        },
        {
          key: "actions",
          header: "",
          className: "text-right whitespace-nowrap",
          render: (asset) => (
            <div className="flex items-center gap-1 justify-end">
              {canUpdate && (
                <Button
                  size={ButtonSizes.XS}
                  variant={ButtonVariants.SECONDARY}
                  onClick={() => handleCompress(asset)}
                  disabled={
                    compressingId === asset.id ||
                    asset.status === ASSET_STATUSES.PENDING ||
                    asset.status === ASSET_STATUSES.PROCESSING ||
                    asset.status === ASSET_STATUSES.OPTIMAL
                  }
                  title={
                    asset.status === ASSET_STATUSES.OPTIMAL
                      ? t(AppLocales.Admin.Assets.Compression.MinSizeTooltip)
                      : t(AppLocales.Admin.Assets.Compression.TriggerTooltip)
                  }
                >
                  <iconsLib.arrowPath
                    className={`w-3.5 h-3.5 ${
                      compressingId === asset.id ||
                      asset.status === ASSET_STATUSES.PENDING ||
                      asset.status === ASSET_STATUSES.PROCESSING
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  {asset.status === ASSET_STATUSES.OPTIMAL
                    ? t(AppLocales.Admin.Assets.Compression.MinSize)
                    : t(AppLocales.Admin.Assets.Compression.Compress)}
                </Button>
              )}
              <AdminTableActions
                resource={ADMIN_RESOURCES.ASSETS}
                actions={[
                  {
                    type: ADMIN_ACTIONS.EDIT,
                    onClick: () => {
                      navigate(
                        AppRoutes.withId(
                          AppRoutes.client.protected.admin.ASSET_EDIT,
                          asset.id,
                        ),
                      );
                    },
                  },
                  {
                    type: ADMIN_ACTIONS.DISCARD,
                    onClick: () => {
                      setAssetToDiscard(asset);
                      setIsDiscardOpen(true);
                    },
                  },
                ]}
              />
            </div>
          ),
        },
      );
    } else {
      base.push(
        {
          key: ADMIN_ASSET_COLUMNS.DISCARDED_AT,
          header: t(AppLocales.Admin.Assets.Table.Discarded),
          sortKey: ADMIN_ASSET_COLUMNS.DISCARDED_AT,
          className: "text-center",
          render: (asset) => formatAdminDate(asset.discarded_at),
        },
        {
          key: "actions",
          header: "",
          className: "text-right whitespace-nowrap",
          render: (asset) => (
            <AdminTableActions
              resource={ADMIN_RESOURCES.ASSETS}
              actions={[
                {
                  type: ADMIN_ACTIONS.UNDISCARD,
                  onClick: () => {
                    setAssetToRestore(asset);
                    setIsRestoreOpen(true);
                  },
                },
                {
                  type: ADMIN_ACTIONS.DESTROY,
                  onClick: () => {
                    setAssetToDestroy(asset);
                    setIsDestroyOpen(true);
                  },
                },
              ]}
            />
          ),
        },
      );
    }

    return base;
  }, [isActive, navigate, t, canUpdate, compressingId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          isActive
            ? t(AppLocales.Admin.Assets.Title)
            : t(AppLocales.Admin.Assets.RecycleTitle)
        }
        description={
          isActive
            ? t(AppLocales.Admin.Assets.Description)
            : t(AppLocales.Admin.Assets.RecycleDescription)
        }
        action={
          isActive && canCreate ? (
            <Button
              onClick={() =>
                navigate(AppRoutes.client.protected.admin.ASSET_CREATE)
              }
            >
              <iconsLib.plus className="w-5 h-5 mr-2" />
              {t(AppLocales.Admin.Assets.UploadButton)}
            </Button>
          ) : !isActive && canDelete ? (
            <AdminEmptyRecycleBinButton
              onConfirm={handleEmptyRecycleBin}
              count={pagination?.total_count}
              disabled={assets.length === 0}
            />
          ) : null
        }
      >
        {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.ASSETS) && (
          <Tabs
            value={view}
            onChange={(tab) => {
              setSelectedIds([]);
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.ASSETS
                  : AppRoutes.client.protected.admin.ASSETS_RECYCLE_BIN,
              );
              updateSearchParams({ page: "1" });
            }}
            items={[
              {
                value: ADMIN_VIEW_MODES.ACTIVE,
                label: t(AppLocales.Admin.Assets.Tabs.ActiveAssets),
              },
              {
                value: ADMIN_VIEW_MODES.DISCARDED,
                label: t(AppLocales.Admin.Assets.Tabs.RecycleBin),
              },
            ]}
          />
        )}
      </PageHeader>

      {isActive && <AdminAssetStorageStats />}

      {isActive && (
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-base-100 p-4 rounded-xl border border-base-200">
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder={t(AppLocales.Admin.Assets.SearchPlaceholder)}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full sm:w-48">
            <Dropdown
              value={typeFilter}
              options={ASSET_TYPE_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(val) =>
                updateSearchParams({ type: val || null, page: "1" })
              }
            />
          </div>
          <div className="w-full sm:w-48">
            <Dropdown
              value={formatFilter}
              options={ASSET_FORMAT_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(val) =>
                updateSearchParams({ format: val || null, page: "1" })
              }
            />
          </div>
          <div className="w-full sm:w-48">
            <Dropdown
              value={statusFilter}
              options={ASSET_STATUS_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(val) =>
                updateSearchParams({ status: val || null, page: "1" })
              }
            />
          </div>
        </div>
      )}

      {selectedIds.length > 0 && (
        <AdminBatchActionBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          actions={batchActions}
        />
      )}

      <div className="bg-base-100 rounded-xl border border-base-200 overflow-hidden">
        {assets.length > 0 ? (
          <>
            <AdminTable
              columns={columns}
              records={assets}
              getRowKey={(asset) => asset.id}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              selectable={canDelete}
              selectedRowKeys={selectedIds}
              onSelectRow={(id, selected) => {
                setSelectedIds((prev) =>
                  selected ? [...prev, id] : prev.filter((item) => item !== id),
                );
              }}
              onSelectAll={(selected) => {
                setSelectedIds(selected ? assets.map((a) => a.id) : []);
              }}
            />
            {pagination && (
              <AdminPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : hasLoadedOnce && !isLoading ? (
          <AdminState
            title={
              isActive
                ? t(AppLocales.Admin.Assets.State.EmptyTitle)
                : t(AppLocales.Admin.Assets.State.RecycleEmptyTitle)
            }
            message={
              isActive
                ? t(AppLocales.Admin.Assets.State.EmptyDesc)
                : t(AppLocales.Admin.Assets.State.RecycleEmptyDesc)
            }
            icon={
              isActive ? (
                <iconsLib.photo className="w-12 h-12" />
              ) : (
                <iconsLib.trash className="w-12 h-12" />
              )
            }
          />
        ) : (
          <div className="py-16 flex items-center justify-center text-base-content/40">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}
      </div>

      {/* Active view dialogs */}
      {isActive && (
        <>
          <ConfirmDialog
            isOpen={isDiscardOpen}
            title={t(AppLocales.Admin.Assets.Confirm.DiscardTitle)}
            message={t(AppLocales.Admin.Assets.Confirm.DiscardMessage)}
            confirmLabel={t(AppLocales.Admin.Common.Actions.Discard)}
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            onConfirm={handleDiscard}
            onClose={() => {
              setIsDiscardOpen(false);
              setAssetToDiscard(null);
            }}
            isLoading={isDiscarding}
            isDestructive
          />
        </>
      )}

      {/* Discarded view dialogs */}
      {!isActive && (
        <>
          <ConfirmDialog
            isOpen={isRestoreOpen}
            title={t(AppLocales.Admin.Assets.Confirm.RestoreTitle)}
            message={t(AppLocales.Admin.Assets.Confirm.RestoreMessage)}
            confirmLabel={t(AppLocales.Admin.Common.Actions.Restore)}
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            onConfirm={handleRestore}
            onClose={() => {
              setIsRestoreOpen(false);
              setAssetToRestore(null);
            }}
            isLoading={isRestoring}
          />

          <ConfirmDialog
            isOpen={isDestroyOpen}
            title={t(AppLocales.Admin.Assets.Confirm.DestroyTitle)}
            message={t(AppLocales.Admin.Assets.Confirm.DestroyMessage)}
            confirmLabel={t(AppLocales.Admin.Common.Actions.Destroy)}
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            onConfirm={handleDestroy}
            onClose={() => {
              setIsDestroyOpen(false);
              setAssetToDestroy(null);
            }}
            isLoading={isDestroying}
            isDestructive
          />
        </>
      )}

      {/* Batch Confirm Dialogs */}
      <ConfirmDialog
        isOpen={isBatchDiscardOpen}
        title={t(AppLocales.Admin.Common.Batch.ConfirmDiscardTitle)}
        message={t(AppLocales.Admin.Common.Batch.ConfirmDiscardMessage, {
          count: String(selectedIds.length),
        })}
        confirmLabel={t(AppLocales.Admin.Common.Batch.DiscardSelected)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleBatchDiscard}
        onClose={() => setIsBatchDiscardOpen(false)}
        isLoading={isBatchDiscarding}
        isDestructive
      />

      <ConfirmDialog
        isOpen={isBatchRestoreOpen}
        title={t(AppLocales.Admin.Common.Batch.ConfirmRestoreTitle)}
        message={t(AppLocales.Admin.Common.Batch.ConfirmRestoreMessage, {
          count: String(selectedIds.length),
        })}
        confirmLabel={t(AppLocales.Admin.Common.Batch.RestoreSelected)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleBatchRestore}
        onClose={() => setIsBatchRestoreOpen(false)}
        isLoading={isBatchRestoring}
      />

      <ConfirmDialog
        isOpen={isBatchDestroyOpen}
        title={t(AppLocales.Admin.Common.Batch.ConfirmDestroyTitle)}
        message={t(AppLocales.Admin.Common.Batch.ConfirmDestroyMessage, {
          count: String(selectedIds.length),
        })}
        confirmLabel={t(AppLocales.Admin.Common.Batch.DestroySelected)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleBatchDestroy}
        onClose={() => setIsBatchDestroyOpen(false)}
        isLoading={isBatchDestroying}
        isDestructive
      />
    </div>
  );
};
