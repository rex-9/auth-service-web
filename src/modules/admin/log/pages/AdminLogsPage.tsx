// src/modules/admin/log/pages/AdminLogsPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import {
  useDocumentTitle,
  usePermissions,
  useSort,
  SORT_ORDERS,
} from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  BadgeSizes,
  BadgeVariants,
  Dropdown,
  DropdownSizes,
  getSeverityBadgeVariant,
  StatusBadge,
} from "../../../../design";
import { formatAdminDate } from "../../../../helpers";
import type { IAdminLog } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  AdminTableActions,
  ConfirmDialog,
  PageHeader,
  Tabs,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_LOG_RESOLUTION,
  ADMIN_LOG_SORT_KEYS,
  ADMIN_LOG_TABLE_KEYS,
  type TAdminLogResolution,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";
import { Admin } from "../..";

interface IAdminLogsPageProps {
  view?: TAdminViewMode;
}

export const AdminLogsPage: React.FC<IAdminLogsPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  const t = useTranslate();
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? `${t(AppLocales.Admin.Logs.Title)} | Admin`
      : `${t(AppLocales.Admin.Logs.RecycleTitle)} | Admin`,
  );

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const resolutionFilter = (searchParams.get("resolution") ||
    ADMIN_LOG_RESOLUTION.UNRESOLVED) as TAdminLogResolution;
  const severityFilter = searchParams.get("severity") || "";
  const platformFilter = searchParams.get("platform") || "";

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_LOG_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { isLoading, setLoading } = useLoading();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const [logs, setLogs] = useState<IAdminLog[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

  const [discardTarget, setDiscardTarget] = useState<IAdminLog | null>(null);
  const [destroyTarget, setDestroyTarget] = useState<IAdminLog | null>(null);

  const updateFilters = useCallback(
    (updates: {
      page?: number;
      resolution?: string;
      severity?: string;
      platform?: string;
    }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          if (updates.resolution !== undefined) {
            if (
              updates.resolution &&
              updates.resolution !== ADMIN_LOG_RESOLUTION.UNRESOLVED
            )
              next.set("resolution", updates.resolution);
            else next.delete("resolution");
          }
          if (updates.severity !== undefined) {
            if (updates.severity) next.set("severity", updates.severity);
            else next.delete("severity");
          }
          if (updates.platform !== undefined) {
            if (updates.platform) next.set("platform", updates.platform);
            else next.delete("platform");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const loadLogs = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.CLIENTS)) return;

    setLoading(true);
    setError("");

    const result = await Admin.LogController.getLogs({
      page,
      limit: ADMIN_PAGE_SIZE,
      severity: severityFilter || undefined,
      platform: platformFilter || undefined,
      unresolved:
        resolutionFilter === ADMIN_LOG_RESOLUTION.UNRESOLVED
          ? "true"
          : undefined,
      resolved:
        resolutionFilter === ADMIN_LOG_RESOLUTION.RESOLVED ? "true" : undefined,
      discarded: view === ADMIN_VIEW_MODES.DISCARDED ? "true" : undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    if (result.success) {
      setLogs(result.logs);
      setPagination(result.pagination);
    } else {
      setError(result.error || t(AppLocales.Admin.Logs.Errors.LoadListFailed));
    }

    setLoading(false);
  }, [
    can,
    page,
    resolutionFilter,
    severityFilter,
    platformFilter,
    setLoading,
    sortBy,
    sortOrder,
    t,
    view,
  ]);

  useEffect(() => {
    if (!permissionsLoading) {
      void loadLogs();
    }
  }, [loadLogs, permissionsLoading]);

  const handleUndiscard = async (log: IAdminLog) => {
    setLoading(true);
    const result = await Admin.LogController.undiscardLog(log.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Logs.Toasts.RestoreSuccess));
      void loadLogs();
    } else {
      toast.error(
        result.error || t(AppLocales.Admin.Logs.Errors.RestoreFailed),
      );
    }
  };

  const handleDiscard = async () => {
    if (!discardTarget) return;

    setLoading(true);
    const result = await Admin.LogController.discardLog(discardTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Logs.Toasts.DiscardSuccess));
      setDiscardTarget(null);
      void loadLogs();
    } else {
      toast.error(
        result.error || t(AppLocales.Admin.Logs.Errors.DiscardFailed),
      );
    }
  };

  const handleDestroy = async () => {
    if (!destroyTarget) return;

    setLoading(true);
    const result = await Admin.LogController.deleteLog(destroyTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Logs.Toasts.DestroySuccess));
      setDestroyTarget(null);
      void loadLogs();
    } else {
      toast.error(
        result.error || t(AppLocales.Admin.Logs.Errors.DestroyFailed),
      );
    }
  };

  const columns: IAdminTableColumn<IAdminLog>[] = useMemo(
    () => [
      {
        key: ADMIN_LOG_TABLE_KEYS.SEVERITY,
        header: t(AppLocales.Admin.Logs.Table.Severity),
        render: (log) => (
          <StatusBadge
            status={log.severity}
            variant={getSeverityBadgeVariant(log.severity)}
          />
        ),
      },
      {
        key: ADMIN_LOG_TABLE_KEYS.MESSAGE,
        header: t(AppLocales.Admin.Logs.Table.Message),
        render: (log) => (
          <div className="max-w-md">
            <div className="line-clamp-2 font-mono text-body-m font-medium text-base-content">
              {log.message}
            </div>
            <div className="text-caption text-base-content opacity-60 font-mono text-xs pt-0.5">
              {log.url || "N/A"}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_LOG_TABLE_KEYS.PLATFORM,
        header: t(AppLocales.Admin.Logs.Table.Platform),
        render: (log) => (
          <div>
            <div className="font-semibold text-base-content">
              {log.platform?.toUpperCase() || "WEB"}
            </div>
            <div className="text-caption text-base-content opacity-60 text-xs font-mono">
              {log.environment || "production"} •{" "}
              {log.browser || log.device || ""}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_LOG_TABLE_KEYS.COUNT,
        header: t(AppLocales.Admin.Logs.Table.Occurrences),
        sortKey: ADMIN_LOG_SORT_KEYS.COUNT,
        render: (log) => (
          <Badge size={BadgeSizes.XS} variant={BadgeVariants.SECONDARY}>
            {log.occurrence_count}×
          </Badge>
        ),
      },
      {
        key: ADMIN_LOG_TABLE_KEYS.LAST_OCCURRED,
        header: t(AppLocales.Admin.Logs.Table.Timestamp),
        sortKey: ADMIN_LOG_SORT_KEYS.CREATED_AT,
        className: "text-center",
        render: (log) =>
          formatAdminDate(log.last_occurred_at || log.created_at),
      },
      {
        key: ADMIN_LOG_TABLE_KEYS.ACTIONS,
        header: "",
        className: "text-right",
        render: (log) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.CLIENTS}
            actions={
              view === ADMIN_VIEW_MODES.ACTIVE
                ? [
                    {
                      type: ADMIN_ACTIONS.INSPECT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.LOG_DETAIL,
                            log.id,
                          ),
                        ),
                    },
                    {
                      type: ADMIN_ACTIONS.DISCARD,
                      onClick: () => setDiscardTarget(log),
                    },
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.INSPECT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.LOG_DETAIL,
                            log.id,
                          ),
                        ),
                    },
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () => void handleUndiscard(log),
                    },
                    {
                      type: ADMIN_ACTIONS.DESTROY,
                      onClick: () => setDestroyTarget(log),
                    },
                  ]
            }
          />
        ),
      },
    ],
    [t, view],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Logs.Title)
            : t(AppLocales.Admin.Logs.RecycleTitle)
        }
        description={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Logs.Description)
            : t(AppLocales.Admin.Logs.RecycleDescription)
        }
      >
        {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.CLIENTS) && (
          <Tabs
            value={view}
            onChange={(tab) => {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.LOGS
                  : AppRoutes.client.protected.admin.LOGS_RECYCLE_BIN,
              );
              updateFilters({ page: 1 });
            }}
            items={[
              {
                value: ADMIN_VIEW_MODES.ACTIVE,
                label: t(AppLocales.Admin.Logs.Tabs.ActiveLogs),
                icon: iconsLib.document,
                count:
                  view === ADMIN_VIEW_MODES.ACTIVE
                    ? pagination?.total_count
                    : undefined,
              },
              {
                value: ADMIN_VIEW_MODES.DISCARDED,
                label: t(AppLocales.Admin.Logs.Tabs.RecycleBin),
                icon: iconsLib.trash,
                count:
                  view === ADMIN_VIEW_MODES.DISCARDED
                    ? pagination?.total_count
                    : undefined,
              },
            ]}
          />
        )}
      </PageHeader>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-40"
          value={resolutionFilter}
          onValueChange={(val) => updateFilters({ resolution: val, page: 1 })}
          options={[
            {
              value: ADMIN_LOG_RESOLUTION.UNRESOLVED,
              label: t(AppLocales.Admin.Logs.Filters.Unresolved),
            },
            {
              value: ADMIN_LOG_RESOLUTION.RESOLVED,
              label: t(AppLocales.Admin.Logs.Filters.Resolved),
            },
            { value: ADMIN_LOG_RESOLUTION.ALL, label: "All Statuses" },
          ]}
        />

        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-40"
          value={severityFilter}
          onValueChange={(val) => updateFilters({ severity: val, page: 1 })}
          options={[
            {
              value: "",
              label: t(AppLocales.Admin.Logs.Filters.AllSeverities),
            },
            { value: "error", label: t(AppLocales.Admin.Logs.Filters.Error) },
            {
              value: "warning",
              label: t(AppLocales.Admin.Logs.Filters.Warning),
            },
            { value: "info", label: t(AppLocales.Admin.Logs.Filters.Low) },
            {
              value: "critical",
              label: t(AppLocales.Admin.Logs.Filters.Fatal),
            },
          ]}
        />

        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-40"
          value={platformFilter}
          onValueChange={(val) => updateFilters({ platform: val, page: 1 })}
          options={[
            { value: "", label: t(AppLocales.Admin.Logs.Filters.AllPlatforms) },
            { value: "web", label: t(AppLocales.Admin.Logs.Filters.Web) },
            { value: "ios", label: t(AppLocales.Admin.Logs.Filters.Ios) },
            {
              value: "android",
              label: t(AppLocales.Admin.Logs.Filters.Android),
            },
          ]}
        />
      </div>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : !isLoading && logs.length === 0 ? (
        <AdminState
          icon={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? iconsLib.document
              : iconsLib.trash
          }
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable<IAdminLog>
            records={logs}
            columns={columns}
            getRowKey={(record) => record.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => updateFilters({ page: nextPage })}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={!!discardTarget}
        title={t(AppLocales.Admin.Common.Confirm.DiscardTitle)}
        message={t(AppLocales.Admin.Common.Confirm.DiscardMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Discard)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={true}
        onConfirm={handleDiscard}
        onClose={() => setDiscardTarget(null)}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={!!destroyTarget}
        title={t(AppLocales.Admin.Common.Confirm.DestroyTitle)}
        message={t(AppLocales.Admin.Common.Confirm.DestroyMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Destroy)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={true}
        onConfirm={handleDestroy}
        onClose={() => setDestroyTarget(null)}
        isLoading={isLoading}
      />
    </div>
  );
};
