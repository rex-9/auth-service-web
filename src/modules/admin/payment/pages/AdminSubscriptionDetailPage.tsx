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
import type { IAdminSubscription } from "../types";

const load = async (id: string) => {
  const result = await PaymentController.getSubscription(id);
  return { ...result, record: result.subscription };
};
const amount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(value / 100);

export const AdminSubscriptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record, error } = useAdminDetail<IAdminSubscription>(id, load);
  const list = AppRoutes.client.protected.admin.SUBSCRIPTIONS;
  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Subscriptions.Title), to: list },
          {
            label:
              record?.product_name || t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={t(AppLocales.Admin.Subscriptions.Detail.Title)}
        description={t(AppLocales.Admin.Subscriptions.Detail.Description)}
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
            title={t(AppLocales.Admin.Subscriptions.Detail.Plan)}
            icon={iconsLib.banknotes}
          >
            <AdminDetailGrid>
              <AdminDetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.Product)}
                value={record.product_name}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Status)}
                value={<StatusBadge status={record.status} />}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Subscriptions.Table.Amount)}
                value={`${amount(record.unit_amount, record.currency)} / ${record.interval}`}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.Quantity)}
                value={record.quantity}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.SubscriptionId)}
                value={record.stripe_subscription_id}
                className="sm:col-span-2"
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Transactions.Detail.User)}
                value={record.user_name || record.username}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Email)}
                value={record.user_email}
              />
            </AdminDetailGrid>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Subscriptions.Detail.Billing)}
            icon={iconsLib.banknotes}
          >
            <AdminDetailGrid>
              <AdminDetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.PeriodStart)}
                value={
                  <DateTime
                    value={record.current_period_start}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Subscriptions.Table.PeriodEnd)}
                value={
                  <DateTime
                    value={record.current_period_end}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.StartedAt)}
                value={
                  <DateTime
                    value={record.started_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.PaymentMethod)}
                value={record.payment_method_display}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Subscriptions.Table.Cancellation)}
                value={
                  record.cancel_at_period_end
                    ? t(AppLocales.Admin.Subscriptions.Scheduled)
                    : "—"
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Updated)}
                value={
                  <DateTime
                    value={record.updated_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
            </AdminDetailGrid>
          </AdminDetailSection>
        </div>
      ) : null}
    </div>
  );
};
