import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  Dropdown,
  SearchInput,
  StatusBadge,
} from "../../../../design";
import {
  SORT_ORDERS,
  useDocumentTitle,
  usePermissions,
  useSort,
} from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { AppLocales, useTranslate } from "../../../../locales";
import {
  BILLING_INTERVALS,
  SUBSCRIPTION_STATUS,
} from "../../../payment/constants";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
} from "../../constants";
import { ADMIN_SUBSCRIPTION_SORT_KEYS } from "../constants";
import PaymentController from "../payment.controller";
import type { IAdminSubscription } from "../types";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export const AdminSubscriptionsPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Subscriptions.Title)} | Admin`);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || 1);
  const status = params.get("status") || "";
  const interval = params.get("interval") || "";
  const search = params.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [records, setRecords] = useState<IAdminSubscription[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const { can, isLoading } = usePermissions();
  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_SUBSCRIPTION_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });
  const update = useCallback(
    (values: Record<string, string | number>) =>
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(values).forEach(([key, value]) =>
            value && value !== 1
              ? next.set(key, String(value))
              : next.delete(key),
          );
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  useEffect(() => {
    const timer = window.setTimeout(
      () =>
        searchInput !== search &&
        update({ search: searchInput.trim(), page: 1 }),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [search, searchInput, update]);
  useEffect(() => {
    if (isLoading || !can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.SUBSCRIPTIONS))
      return;
    void PaymentController.getSubscriptions({
      page,
      limit: ADMIN_PAGE_SIZE,
      status: status || undefined,
      interval: interval || undefined,
      search: search || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    }).then((result) => {
      setRecords(result.subscriptions);
      setPagination(result.pagination);
      setError(
        result.success
          ? ""
          : result.error || t(AppLocales.Admin.Subscriptions.Errors.Load),
      );
    });
  }, [can, interval, isLoading, page, search, sortBy, sortOrder, status, t]);

  const columns: IAdminTableColumn<IAdminSubscription>[] = [
    {
      key: "subscription",
      header: t(AppLocales.Admin.Subscriptions.Table.Subscription),
      render: (record) => (
        <div>
          <div className="font-semibold">{record.product_name || "—"}</div>
          <div className="font-mono text-xs opacity-60">
            {record.stripe_subscription_id}
          </div>
        </div>
      ),
    },
    {
      key: "user",
      header: t(AppLocales.Admin.Subscriptions.Table.User),
      render: (record) => (
        <div>
          <div className="font-medium">
            {record.user_name || record.username || "—"}
          </div>
          <div className="text-xs opacity-60">{record.user_email}</div>
        </div>
      ),
    },
    {
      key: "amount",
      header: t(AppLocales.Admin.Subscriptions.Table.Amount),
      sortKey: ADMIN_SUBSCRIPTION_SORT_KEYS.UNIT_AMOUNT,
      render: (record) => (
        <div className="font-semibold">
          {money(record.unit_amount, record.currency)}
          <span className="font-normal opacity-60"> / {record.interval}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: t(AppLocales.Admin.Common.Detail.Status),
      sortKey: ADMIN_SUBSCRIPTION_SORT_KEYS.STATUS,
      render: (record) => <StatusBadge status={record.status} />,
    },
    {
      key: "period",
      header: t(AppLocales.Admin.Subscriptions.Table.PeriodEnd),
      sortKey: ADMIN_SUBSCRIPTION_SORT_KEYS.CURRENT_PERIOD_END,
      render: (record) => (
        <DateTime
          value={record.current_period_end}
          format={DateTimeFormats.ADMIN}
        />
      ),
    },
    {
      key: "canceling",
      header: t(AppLocales.Admin.Subscriptions.Table.Cancellation),
      render: (record) =>
        record.cancel_at_period_end
          ? t(AppLocales.Admin.Subscriptions.Scheduled)
          : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Subscriptions.Title)}
        description={t(AppLocales.Admin.Subscriptions.Description)}
      />
      <div className="grid gap-3 sm:grid-cols-[14rem_14rem_1fr]">
        <Dropdown
          value={status}
          onValueChange={(value) => update({ status: value, page: 1 })}
          options={[
            {
              value: "",
              label: t(AppLocales.Admin.Subscriptions.Filters.AllStatuses),
            },
            ...Object.values(SUBSCRIPTION_STATUS).map((value) => ({
              value,
              label: value.replace(/_/g, " "),
            })),
          ]}
        />
        <Dropdown
          value={interval}
          onValueChange={(value) => update({ interval: value, page: 1 })}
          options={[
            {
              value: "",
              label: t(AppLocales.Admin.Subscriptions.Filters.AllIntervals),
            },
            ...Object.values(BILLING_INTERVALS).map((value) => ({
              value,
              label: value,
            })),
          ]}
        />
        <SearchInput
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onClear={() => setSearchInput("")}
          placeholder={t(AppLocales.Admin.Subscriptions.Search)}
        />
      </div>
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : records.length === 0 ? (
        <AdminState
          icon={iconsLib.banknotes}
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable
            records={records}
            columns={columns}
            getRowKey={(record) => record.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onRowClick={(record) =>
              navigate(
                AppRoutes.withId(
                  AppRoutes.client.protected.admin.SUBSCRIPTION_DETAIL,
                  record.id,
                ),
              )
            }
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(value) => update({ page: value })}
          />
        </>
      )}
    </div>
  );
};
