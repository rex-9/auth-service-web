import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  Dropdown,
  DropdownSizes,
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
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
} from "../../constants";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import PaymentController from "../payment.controller";
import { ADMIN_TRANSACTION_SORT_KEYS } from "../constants";
import type { IAdminTransaction } from "../types";
import { TRANSACTION_STATUS } from "../../../payment/constants";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export const AdminTransactionsPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Transactions.Title)} | Admin`);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || 1);
  const status = params.get("status") || "";
  const search = params.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [records, setRecords] = useState<IAdminTransaction[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const { can, isLoading } = usePermissions();
  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_TRANSACTION_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const update = useCallback(
    (values: Record<string, string | number>) => {
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
      );
    },
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
    if (isLoading || !can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.TRANSACTIONS))
      return;
    void PaymentController.getTransactions({
      page,
      limit: ADMIN_PAGE_SIZE,
      status: status || undefined,
      search: search || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    }).then((result) => {
      setRecords(result.transactions);
      setPagination(result.pagination);
      setError(
        result.success
          ? ""
          : result.error || t(AppLocales.Admin.Transactions.Errors.Load),
      );
    });
  }, [can, isLoading, page, search, sortBy, sortOrder, status, t]);

  const columns: IAdminTableColumn<IAdminTransaction>[] = [
    {
      key: "purchase",
      header: t(AppLocales.Admin.Transactions.Table.Purchase),
      render: (record) => (
        <div>
          <div className="font-semibold">{record.product_name || "—"}</div>
          <div className="font-mono text-xs opacity-60">
            {record.stripe_payment_intent_id}
          </div>
        </div>
      ),
    },
    {
      key: "user",
      header: t(AppLocales.Admin.Transactions.Table.User),
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
      header: t(AppLocales.Admin.Transactions.Table.Amount),
      sortKey: ADMIN_TRANSACTION_SORT_KEYS.UNIT_AMOUNT,
      render: (record) => (
        <span className="font-semibold">
          {money(record.unit_amount, record.currency)}
        </span>
      ),
    },
    {
      key: "status",
      header: t(AppLocales.Admin.Common.Detail.Status),
      sortKey: ADMIN_TRANSACTION_SORT_KEYS.STATUS,
      render: (record) => <StatusBadge status={record.status} />,
    },
    {
      key: "method",
      header: t(AppLocales.Admin.Transactions.Table.Method),
      render: (record) => record.payment_method_display || "—",
    },
    {
      key: "created",
      header: t(AppLocales.Admin.Common.Detail.Created),
      sortKey: ADMIN_TRANSACTION_SORT_KEYS.CREATED_AT,
      render: (record) => (
        <DateTime
          value={record.paid_at || record.created_at}
          format={DateTimeFormats.ADMIN}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Transactions.Title)}
        description={t(AppLocales.Admin.Transactions.Description)}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Dropdown
          size={DropdownSizes.MD}
          containerClassName="sm:w-56"
          value={status}
          onValueChange={(value) => update({ status: value, page: 1 })}
          options={[
            { value: "", label: t(AppLocales.Admin.Transactions.Filters.All) },
            ...Object.values(TRANSACTION_STATUS).map((value) => ({
              value,
              label: value.replace(/_/g, " "),
            })),
          ]}
        />
        <div className="w-full sm:w-80">
          <SearchInput
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onClear={() => setSearchInput("")}
            placeholder={t(AppLocales.Admin.Transactions.Search)}
          />
        </div>
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
                  AppRoutes.client.protected.admin.TRANSACTION_DETAIL,
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
