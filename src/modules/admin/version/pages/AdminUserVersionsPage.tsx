import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import {
  useDocumentTitle,
  usePermissions,
  useSort,
  SORT_ORDERS,
} from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import { Button, StatusBadge } from "../../../../design";
import { ButtonVariants, DropdownSizes } from "../../../../design/constants";
import type { IAdminUserVersion, IAdminVersion } from "../types";
import VersionController from "../version.controller";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  Dropdown,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
} from "../../constants";
import {
  ADMIN_USER_VERSION_SORT_KEYS,
  ADMIN_USER_VERSION_TABLE_KEYS,
  VERSION_PLATFORMS,
} from "../constants";
import { formatAdminDate } from "../../../../helpers";
import { useTranslate, AppLocales } from "../../../../locales";

interface IAdminUserVersionsPageProps {
  embedded?: boolean;
}

export const AdminUserVersionsPage: React.FC<IAdminUserVersionsPageProps> = ({
  embedded = false,
}) => {
  const t = useTranslate();
  const { id: versionId } = useParams<{ id: string }>();
  const isVersionScoped = Boolean(versionId);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const platformFilter = searchParams.get("platform") || "";

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_USER_VERSION_SORT_KEYS.LAST_SEEN_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { isLoading, setLoading } = useLoading();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const [version, setVersion] = useState<IAdminVersion | null>(null);
  const [userVersions, setUserVersions] = useState<IAdminUserVersion[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

  useDocumentTitle(`${t(AppLocales.Admin.UserVersions.Title)} | Admin`);

  const updateFilters = useCallback(
    (updates: { page?: number; platform?: string }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          if (updates.platform !== undefined) {
            if (updates.platform) next.set("platform", updates.platform);
            else next.delete("platform");
            next.delete("page");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const loadUserVersions = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.USER_VERSIONS)) return;
    if (isVersionScoped && !versionId) return;

    setLoading(true);
    setError("");

    const listParams = {
      page,
      limit: ADMIN_PAGE_SIZE,
      sort_by: sortBy,
      sort_order: sortOrder,
      ...(!isVersionScoped && platformFilter
        ? { platform: platformFilter }
        : {}),
    };

    const [versionResult, userVersionsResult] = await Promise.all([
      isVersionScoped && versionId && !embedded
        ? VersionController.getVersion(versionId)
        : Promise.resolve({ success: true as const, version: undefined }),
      isVersionScoped && versionId
        ? VersionController.getUserVersionByVersion(versionId, listParams)
        : VersionController.getUserVersions(listParams),
    ]);

    if (versionResult.success && versionResult.version) {
      setVersion(versionResult.version);
    }

    if (userVersionsResult.success) {
      setUserVersions(userVersionsResult.userVersions);
      setPagination(userVersionsResult.pagination);
    } else {
      setError(
        userVersionsResult.error ||
          t(AppLocales.Admin.UserVersions.Errors.LoadList),
      );
    }

    setLoading(false);
  }, [
    can,
    embedded,
    isVersionScoped,
    page,
    platformFilter,
    setLoading,
    sortBy,
    sortOrder,
    t,
    versionId,
  ]);

  useEffect(() => {
    if (permissionsLoading) return;

    const timeoutId = window.setTimeout(() => {
      void loadUserVersions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadUserVersions, permissionsLoading]);

  const columns = useMemo<IAdminTableColumn<IAdminUserVersion>[]>(
    () => [
      {
        key: ADMIN_USER_VERSION_TABLE_KEYS.USER,
        header: t(AppLocales.Admin.UserVersions.Table.User),
        render: (userVersion) => (
          <div className="font-medium text-base-content">
            {userVersion.user_email || userVersion.user_id}
          </div>
        ),
      },
      {
        key: ADMIN_USER_VERSION_TABLE_KEYS.PLATFORM,
        header: t(AppLocales.Admin.UserVersions.Table.Platform),
        sortKey: ADMIN_USER_VERSION_SORT_KEYS.PLATFORM,
        render: (userVersion) => <StatusBadge status={userVersion.platform} />,
      },
      {
        key: ADMIN_USER_VERSION_TABLE_KEYS.NUMBER,
        header: t(AppLocales.Admin.UserVersions.Table.Number),
        sortKey: ADMIN_USER_VERSION_SORT_KEYS.NUMBER,
        render: (userVersion) => (
          <span className="font-mono text-base-content">
            {userVersion.number}
          </span>
        ),
      },
      {
        key: ADMIN_USER_VERSION_TABLE_KEYS.BUILD,
        header: t(AppLocales.Admin.UserVersions.Table.Build),
        render: (userVersion) => (
          <span className="text-base-content">
            {userVersion.build_number ?? "—"}
          </span>
        ),
      },
      {
        key: ADMIN_USER_VERSION_TABLE_KEYS.LAST_SEEN,
        header: t(AppLocales.Admin.UserVersions.Table.LastSeen),
        sortKey: ADMIN_USER_VERSION_SORT_KEYS.LAST_SEEN_AT,
        className: "text-center",
        render: (userVersion) => formatAdminDate(userVersion.last_seen_at),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      {!embedded && (
        <PageHeader
          title={
            isVersionScoped && version
              ? t(AppLocales.Admin.UserVersions.TitleWithVersion, {
                  number: version.number,
                  title: version.title,
                })
              : t(AppLocales.Admin.UserVersions.Title)
          }
          description={
            isVersionScoped
              ? t(AppLocales.Admin.UserVersions.ScopedDescription)
              : t(AppLocales.Admin.UserVersions.Description)
          }
          action={
            isVersionScoped ? (
              <Button
                variant={ButtonVariants.SECONDARY}
                onClick={() =>
                  navigate(AppRoutes.client.protected.admin.VERSIONS)
                }
              >
                <iconsLib.arrowLeft className="mr-2 h-4 w-4" />
                {t(AppLocales.Admin.UserVersions.BackToVersions)}
              </Button>
            ) : null
          }
        />
      )}

      {!isVersionScoped && (
        <Dropdown
          size={DropdownSizes.MD}
          containerClassName="w-full sm:max-w-sm"
          label={t(AppLocales.Admin.UserVersions.Filters.Platform)}
          value={platformFilter}
          onValueChange={(value) => updateFilters({ platform: value })}
          options={[
            {
              value: "",
              label: t(AppLocales.Admin.UserVersions.Filters.AllPlatforms),
            },
            {
              value: VERSION_PLATFORMS.IOS,
              label: t(AppLocales.Admin.UserVersions.Platforms.Ios),
            },
            {
              value: VERSION_PLATFORMS.ANDROID,
              label: t(AppLocales.Admin.UserVersions.Platforms.Android),
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
      ) : !isLoading && userVersions.length === 0 ? (
        <AdminState
          icon={iconsLib.devicePhoneMobile}
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.UserVersions.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable<IAdminUserVersion>
            records={userVersions}
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
    </div>
  );
};
