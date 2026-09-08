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
  Button,
  Dropdown,
  DropdownSizes,
  StatusBadge,
} from "../../../../design";
import { ButtonVariants } from "../../../../design/constants";
import type { IAdminVersion } from "../types";
import VersionController from "../version.controller";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
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
  ADMIN_VERSION_SORT_KEYS,
  ADMIN_VERSION_TABLE_KEYS,
  VERSION_STATUSES,
} from "../constants";
import { formatAdminDate } from "../../../../helpers";
import { useTranslate, AppLocales } from "../../../../locales";

type VersionLifecycleAction =
  | typeof ADMIN_ACTIONS.DISCARD
  | typeof ADMIN_ACTIONS.UNDISCARD;

interface IAdminVersionsPageProps {
  view?: TAdminViewMode;
}

export const AdminVersionsPage: React.FC<IAdminVersionsPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  const t = useTranslate();
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? `${t(AppLocales.Admin.Versions.Title)} | Admin`
      : `${t(AppLocales.Admin.Versions.RecycleTitle)} | Admin`,
  );

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const statusFilter = searchParams.get("status") || "";

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy:
      view === ADMIN_VIEW_MODES.ACTIVE
        ? ADMIN_VERSION_SORT_KEYS.CREATED_AT
        : ADMIN_VERSION_SORT_KEYS.DISCARDED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { isLoading, setLoading } = useLoading();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const [versions, setVersions] = useState<IAdminVersion[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [lifecycleTarget, setLifecycleTarget] = useState<{
    version: IAdminVersion;
    action: VersionLifecycleAction;
  } | null>(null);

  const updateFilters = useCallback(
    (updates: { page?: number; status?: string }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          if (updates.status !== undefined) {
            if (updates.status) next.set("status", updates.status);
            else next.delete("status");
            next.delete("page");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const openUserVersions = useCallback(
    (versionId: string) => {
      navigate(
        AppRoutes.withId(
          AppRoutes.client.protected.admin.VERSION_INSTALLS,
          versionId,
        ),
      );
    },
    [navigate],
  );

  const loadVersions = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.VERSIONS)) return;

    setLoading(true);
    setError("");

    const params = {
      page,
      limit: ADMIN_PAGE_SIZE,
      sort_by: sortBy,
      sort_order: sortOrder,
      ...(view === ADMIN_VIEW_MODES.ACTIVE && statusFilter
        ? { status: statusFilter }
        : {}),
    };

    const result =
      view === ADMIN_VIEW_MODES.ACTIVE
        ? await VersionController.getVersions(params)
        : await VersionController.getDiscardedVersions(params);

    if (result.success) {
      setVersions(result.versions);
      setPagination(result.pagination);
    } else {
      setError(result.error || t(AppLocales.Admin.Versions.Errors.LoadList));
    }
    setLoading(false);
  }, [can, page, setLoading, sortBy, sortOrder, statusFilter, t, view]);

  useEffect(() => {
    if (permissionsLoading) return;

    const timeoutId = window.setTimeout(() => {
      void loadVersions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadVersions, permissionsLoading]);

  const columns = useMemo<IAdminTableColumn<IAdminVersion>[]>(
    () => [
      {
        key: ADMIN_VERSION_TABLE_KEYS.NUMBER,
        header: t(AppLocales.Admin.Versions.Table.Number),
        sortKey: ADMIN_VERSION_SORT_KEYS.NUMBER,
        render: (version) => (
          <div className="font-mono font-semibold text-base-content">
            {version.number}
          </div>
        ),
      },
      {
        key: ADMIN_VERSION_TABLE_KEYS.TITLE,
        header: t(AppLocales.Admin.Versions.Table.Title),
        sortKey: ADMIN_VERSION_SORT_KEYS.TITLE,
        render: (version) => (
          <div className="font-medium text-base-content">{version.title}</div>
        ),
      },
      {
        key: ADMIN_VERSION_TABLE_KEYS.STATUS,
        header: t(AppLocales.Admin.Versions.Table.Status),
        sortKey: ADMIN_VERSION_SORT_KEYS.STATUS,
        render: (version) => <StatusBadge status={version.status} />,
      },
      {
        key: ADMIN_VERSION_TABLE_KEYS.FORCE,
        header: t(AppLocales.Admin.Versions.Table.ForceUpdate),
        render: (version) =>
          version.is_force_update ? (
            <StatusBadge status="urgent" label={t(AppLocales.Admin.Versions.Table.Force)} />
          ) : (
            <span className="text-caption text-base-content opacity-50">—</span>
          ),
      },
      {
        key: ADMIN_VERSION_TABLE_KEYS.INSTALLS,
        header: t(AppLocales.Admin.Versions.Table.Installs),
        sortKey: ADMIN_VERSION_SORT_KEYS.INSTALL_COUNT,
        render: (version) => (
          <Button
            variant={ButtonVariants.TERTIARY}
            onClick={() => openUserVersions(version.id)}
          >
            {version.install_count ?? 0}
          </Button>
        ),
      },
      {
        key:
          view === ADMIN_VIEW_MODES.ACTIVE
            ? ADMIN_VERSION_TABLE_KEYS.RELEASED_AT
            : ADMIN_VERSION_TABLE_KEYS.DISCARDED_AT,
        header:
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Versions.Table.ReleasedAt)
            : t(AppLocales.Admin.Common.Table.DiscardedAt),
        sortKey:
          view === ADMIN_VIEW_MODES.ACTIVE
            ? ADMIN_VERSION_SORT_KEYS.RELEASED_AT
            : ADMIN_VERSION_SORT_KEYS.DISCARDED_AT,
        className: "text-center",
        render: (version) =>
          formatAdminDate(
            view === ADMIN_VIEW_MODES.ACTIVE
              ? version.released_at
              : version.discarded_at,
          ),
      },
      {
        key: ADMIN_VERSION_TABLE_KEYS.ACTIONS,
        header: t(AppLocales.Admin.Common.Table.Actions),
        className: "text-right",
        render: (version) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.VERSIONS}
            actions={
              view === ADMIN_VIEW_MODES.ACTIVE
                ? [
                    {
                      type: ADMIN_ACTIONS.EDIT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.VERSION_EDIT,
                            version.id,
                          ),
                        ),
                    },
                    {
                      type: ADMIN_ACTIONS.INSPECT,
                      onClick: () => openUserVersions(version.id),
                    },
                    {
                      type: ADMIN_ACTIONS.DISCARD,
                      onClick: () =>
                        setLifecycleTarget({
                          version,
                          action: ADMIN_ACTIONS.DISCARD,
                        }),
                    },
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () =>
                        setLifecycleTarget({
                          version,
                          action: ADMIN_ACTIONS.UNDISCARD,
                        }),
                    },
                  ]
            }
          />
        ),
      },
    ],
    [navigate, openUserVersions, t, view],
  );

  const handleLifecycleAction = async () => {
    if (
      !lifecycleTarget ||
      !can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.VERSIONS)
    )
      return;

    setLoading(true);
    const result =
      lifecycleTarget.action === ADMIN_ACTIONS.DISCARD
        ? await VersionController.discardVersion(lifecycleTarget.version.id)
        : await VersionController.undiscardVersion(lifecycleTarget.version.id);
    setLoading(false);

    if (result.success) {
      toast.success(
        result.message ||
          (lifecycleTarget.action === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Versions.Toasts.DiscardSuccess)
            : t(AppLocales.Admin.Versions.Toasts.RestoreSuccess)),
      );
      setLifecycleTarget(null);
      void loadVersions();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Versions.Errors.Update));
    }
  };

  const canCreate = can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.VERSIONS);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Versions.Title)
            : t(AppLocales.Admin.Versions.RecycleTitle)
        }
        description={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? t(AppLocales.Admin.Versions.Description)
            : t(AppLocales.Admin.Versions.RecycleDescription)
        }
        action={
          view === ADMIN_VIEW_MODES.ACTIVE && canCreate ? (
            <Button
              onClick={() =>
                navigate(AppRoutes.client.protected.admin.VERSION_CREATE)
              }
            >
              <iconsLib.plus className="mr-2 h-4 w-4" />
              {t(AppLocales.Admin.Versions.Form.CreateVersion)}
            </Button>
          ) : null
        }
      >
        {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.VERSIONS) && (
          <Tabs
            value={view}
            onChange={(tab) => {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.VERSIONS
                  : AppRoutes.client.protected.admin.VERSIONS_RECYCLE_BIN,
              );
              updateFilters({ page: 1 });
            }}
            items={[
              {
                value: ADMIN_VIEW_MODES.ACTIVE,
                label: t(AppLocales.Admin.Versions.Tabs.ActiveVersions),
                icon: iconsLib.sparkles,
                count:
                  view === ADMIN_VIEW_MODES.ACTIVE
                    ? pagination?.total_count
                    : undefined,
              },
              {
                value: ADMIN_VIEW_MODES.DISCARDED,
                label: t(AppLocales.Admin.Versions.Tabs.RecycleBin),
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

      {view === ADMIN_VIEW_MODES.ACTIVE && (
        <Dropdown
          size={DropdownSizes.MD}
          containerClassName="w-full sm:max-w-sm"
          label={t(AppLocales.Admin.Versions.Filters.Status)}
          value={statusFilter}
          onValueChange={(value) => updateFilters({ status: value })}
          options={[
            {
              value: "",
              label: t(AppLocales.Admin.Versions.Filters.AllStatuses),
            },
            {
              value: VERSION_STATUSES.DRAFT,
              label: t(AppLocales.Admin.Versions.Status.Draft),
            },
            {
              value: VERSION_STATUSES.PUBLISHED,
              label: t(AppLocales.Admin.Versions.Status.Published),
            },
            {
              value: VERSION_STATUSES.YANKED,
              label: t(AppLocales.Admin.Versions.Status.Yanked),
            },
          ]}
        />
      )}

      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : !isLoading && versions.length === 0 ? (
        <AdminState
          icon={iconsLib.tag}
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable<IAdminVersion>
            records={versions}
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
        isOpen={Boolean(lifecycleTarget)}
        title={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Confirm.DiscardTitle)
            : t(AppLocales.Admin.Common.Confirm.RestoreTitle)
        }
        message={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Confirm.DiscardMessage)
            : t(AppLocales.Admin.Common.Confirm.RestoreMessage)
        }
        confirmLabel={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Actions.Discard)
            : t(AppLocales.Admin.Common.Actions.Restore)
        }
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD}
        isLoading={isLoading}
        onClose={() => !isLoading && setLifecycleTarget(null)}
        onConfirm={handleLifecycleAction}
      />
    </div>
  );
};
