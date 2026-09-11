import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { DateTime, DateTimeFormats, StatusBadge } from "../../../../design";
import { AppLocales, useTranslate } from "../../../../locales";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import PaymentController from "../payment.controller";
import type { IAdminTransaction } from "../types";

const load = async (id: string) => {
  const result = await PaymentController.getTransaction(id);
  return { ...result, record: result.transaction };
};
const amount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(value / 100);

export const AdminTransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record, error } = useAdminDetail<IAdminTransaction>(id, load);
  const list = AppRoutes.client.protected.admin.TRANSACTIONS;
  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Transactions.Title), to: list },
          {
            label:
              record?.product_name || t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={t(AppLocales.Admin.Transactions.Detail.Title)}
        description={t(AppLocales.Admin.Transactions.Detail.Description)}
        backTo={list}
      />
      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : record ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminDetailSection
            title={t(AppLocales.Admin.Transactions.Detail.Purchase)}
            icon={iconsLib.banknotes}
          >
            <AdminDetailGrid>
              <AdminDetailField
                label={t(AppLocales.Admin.Transactions.Table.Amount)}
                value={amount(record.unit_amount, record.currency)}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Status)}
                value={<StatusBadge status={record.status} />}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Transactions.Detail.Product)}
                value={record.product_name}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Transactions.Detail.ProductCode)}
                value={record.product_code}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={
                  <DateTime
                    value={record.created_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Transactions.Detail.PaidAt)}
                value={
                  record.paid_at ? (
                    <DateTime
                      value={record.paid_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  ) : (
                    "—"
                  )
                }
              />
            </AdminDetailGrid>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Transactions.Detail.Payment)}
            icon={iconsLib.banknotes}
          >
            <AdminDetailGrid>
              <AdminDetailField
                label={t(AppLocales.Admin.Transactions.Detail.User)}
                value={record.user_name || record.username}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Email)}
                value={record.user_email}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Transactions.Detail.PaymentMethod)}
                value={record.payment_method_display}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Transactions.Detail.PaymentIntent)}
                value={record.stripe_payment_intent_id}
                className="sm:col-span-2"
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Transactions.Detail.Charge)}
                value={record.stripe_charge_id}
              />
            </AdminDetailGrid>
          </AdminDetailSection>
        </div>
      ) : null}
    </div>
  );
};
