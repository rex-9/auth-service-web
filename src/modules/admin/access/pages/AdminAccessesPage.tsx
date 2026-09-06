// src/modules/admin/access/pages/AdminAccessesPage.tsx

import React, { useCallback, useEffect, useState } from "react";
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
  SearchInput,
  StatusBadge,
} from "../../../../design/components";
import type { IAdminAccess } from "../types";
import AccessController from "../access.controller";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  AdminTableActions,
  ConfirmDialog,
  PageHeader,
  type IAdminTableAction,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_ACTIONS,
  ADMIN_RESOURCES,
} from "../../constants";
import {
  ADMIN_ACCESS_SORT_KEYS,
  ADMIN_ACCESS_STATUS,
  ADMIN_ACCESS_TABLE_KEYS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

import { DropdownSizes } from "../../../../design/constants";
import { formatAdminDate } from "../../../../helpers";

export const AdminAccessesPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Accesses.Title)} | Admin`);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const statusFilter = searchParams.get("status") || "";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_ACCESS_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { isLoading, setLoading } = useLoading();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const [accesses, setAccesses] = useState<IAdminAccess[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

  const [revokeTarget, setRevokeTarget] = useState<IAdminAccess | null>(null);

  const updateFilters = useCallback(
    (updates: { page?: number; status?: string; search?: string }) => {
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
          }
          if (updates.search !== undefined) {
            if (updates.search.trim())
              next.set("search", updates.search.trim());
            else next.delete("search");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Keep local search input in sync if URL search param changes externally
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Debounce search input by 300ms before updating URL and querying API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== searchQuery) {
        updateFilters({ search: searchInput.trim(), page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateFilters]);

  const loadAccesses = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ACCESSES)) return;

    setLoading(true);
    setError("");

    const result = await AccessController.getAccesses({
      page,
      limit: ADMIN_PAGE_SIZE,
      status: statusFilter || undefined,
      search: searchQuery.trim() || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    if (result.success) {
      setAccesses(result.accesses);
      setPagination(result.pagination);
    } else {
      setError(
        result.error || t(AppLocales.Admin.Accesses.Errors.LoadListFailed),
      );
    }

    setLoading(false);
  }, [can, page, statusFilter, searchQuery, setLoading, sortBy, sortOrder, t]);

  useEffect(() => {
    if (!permissionsLoading) {
      void loadAccesses();
    }
  }, [loadAccesses, permissionsLoading]);

  const handleRevoke = async () => {
    if (!revokeTarget) return;

    setLoading(true);
    const result = await AccessController.revokeAccess(revokeTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Accesses.Toasts.RevokeSuccess));
      setRevokeTarget(null);
      void loadAccesses();
    } else {
      toast.error(
        result.error || t(AppLocales.Admin.Accesses.Errors.RevokeFailed),
      );
    }
  };

  const columns: IAdminTableColumn<IAdminAccess>[] = [
    {
      key: ADMIN_ACCESS_TABLE_KEYS.USER,
      header: t(AppLocales.Admin.Accesses.Table.User),
      sortKey: ADMIN_ACCESS_SORT_KEYS.USER_NAME,
      render: (access) => {
        const displayName =
          access.user_name || access.username || access.user_email || "User";
        return (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base-content">
                {displayName}
              </span>
              {access.username && access.user_name && (
                <span className="text-caption text-base-content opacity-50 text-xs">
                  (@{access.username})
                </span>
              )}
            </div>
            {access.user_email && (
              <div className="text-caption text-base-content opacity-60 text-xs">
                {access.user_email}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.PRODUCT,
      header: t(AppLocales.Admin.Accesses.Table.Product),
      sortKey: ADMIN_ACCESS_SORT_KEYS.PRODUCT_NAME,
      render: (access) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-base-content">
              {access.product_name || "Product"}
            </span>
            {access.product_code && (
              <span className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-[11px] font-medium text-base-content opacity-80">
                {access.product_code}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.STATUS,
      header: t(AppLocales.Admin.Accesses.Table.Status),
      render: (access) => <StatusBadge status={access.status} />,
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.GRANTED_AT,
      header: t(AppLocales.Admin.Accesses.Table.GrantedAt),
      sortKey: ADMIN_ACCESS_SORT_KEYS.CREATED_AT,
      className: "text-center",
      render: (access) => formatAdminDate(access.granted_at),
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.EXPIRES_AT,
      header: t(AppLocales.Admin.Accesses.Table.ExpiresAt),
      sortKey: ADMIN_ACCESS_SORT_KEYS.EXPIRES_AT,
      className: "text-center",
      render: (access) => {
        if (!access.expires_at)
          return (
            <span className="text-success font-semibold">
              {t(AppLocales.Admin.Common.Status.Lifetime)}
            </span>
          );
        return (
          <div className="flex flex-col items-center justify-center text-center">
            {formatAdminDate(access.expires_at)}
            {access.remaining_days !== undefined &&
              access.remaining_days !== null &&
              access.remaining_days > 0 && (
                <span className="text-caption text-base-content opacity-60">
                  (
                  {t(AppLocales.Admin.Accesses.GrantDialog.DurationDays, {
                    days: access.remaining_days,
                  })}
                  )
                </span>
              )}
          </div>
        );
      },
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.ACTIONS,
      header: t(AppLocales.Admin.Accesses.Table.Actions),
      className: "text-right",
      render: (access) => {
        const actions: IAdminTableAction[] = [];

        if (access.status !== ADMIN_ACCESS_STATUS.REVOKED) {
          actions.push({
            type: ADMIN_ACTIONS.EXTEND,
            onClick: () =>
              navigate(
                AppRoutes.withId(
                  AppRoutes.client.protected.admin.ACCESS_EDIT,
                  access.id,
                ),
              ),
          });

          actions.push({
            type: ADMIN_ACTIONS.REVOKE,
            onClick: () => setRevokeTarget(access),
          });
        }

        if (actions.length === 0) return null;

        return (
          <AdminTableActions
            resource={ADMIN_RESOURCES.ACCESSES}
            actions={actions}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <ConfirmDialog
        isOpen={Boolean(revokeTarget)}
        title={t(AppLocales.Admin.Common.Confirm.RevokeTitle)}
        message={t(AppLocales.Admin.Common.Confirm.RevokeMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Revoke)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={true}
        onConfirm={handleRevoke}
        onClose={() => setRevokeTarget(null)}
      />

      {/* Header */}
      <PageHeader
        title={t(AppLocales.Admin.Accesses.Title)}
        description={t(AppLocales.Admin.Accesses.Description)}
        action={
          can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.ACCESSES) ? (
            <Button
              variant="primary"
              onClick={() =>
                navigate(AppRoutes.client.protected.admin.ACCESS_CREATE)
              }
              className="flex items-center gap-1.5"
            >
              <iconsLib.plus className="h-4 w-4" />
              {t(AppLocales.Admin.Accesses.GrantButton)}
            </Button>
          ) : null
        }
      />

      {/* Filters & Search Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Dropdown
            size={DropdownSizes.SM}
            containerClassName="w-auto min-w-44"
            value={statusFilter}
            onValueChange={(val) => updateFilters({ status: val, page: 1 })}
            options={[
              {
                value: "",
                label: t(AppLocales.Admin.Accesses.Filters.AllTypes),
              },
              {
                value: ADMIN_ACCESS_STATUS.ACTIVE,
                label: t(AppLocales.Admin.Common.Status.Active),
              },
              {
                value: ADMIN_ACCESS_STATUS.REVOKED,
                label: t(AppLocales.Admin.Common.Status.Revoked),
              },
              {
                value: ADMIN_ACCESS_STATUS.EXPIRED,
                label: t(AppLocales.Admin.Common.Status.Expired),
              },
            ]}
          />
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder={t(AppLocales.Admin.Accesses.SearchPlaceholder)}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClear={() => setSearchInput("")}
          />
        </div>
      </div>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : !isLoading && accesses.length === 0 ? (
        <AdminState
          icon={iconsLib.shieldCheck}
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable<IAdminAccess>
            records={accesses}
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
