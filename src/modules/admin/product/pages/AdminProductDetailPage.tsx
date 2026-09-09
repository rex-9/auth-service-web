import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { Image, StatusBadge } from "../../../../design";
import { formatAdminDate } from "../../../../helpers";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import ProductController from "../product.controller";
import type { IAdminProduct } from "../types";

const loadProduct = async (id: string) => {
  const result = await ProductController.getProduct(id);
  return { ...result, record: result.product };
};
export const AdminProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: product, error } = useAdminDetail<IAdminProduct>(
    id,
    loadProduct,
  );
  const listPath = AppRoutes.client.protected.admin.PRODUCTS;
  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Products.Title), to: listPath },
          { label: product?.name || t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={t(AppLocales.Admin.Products.Detail.Title)}
        description={t(AppLocales.Admin.Products.Detail.Description)}
        backTo={listPath}
      />
      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Products.Errors.LoadOne)}
          message={error}
        />
      ) : product ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <AdminDetailSection
            title={t(AppLocales.Admin.Products.Detail.Product)}
            icon={iconsLib.photo}
          >
            {product.thumbnail_url && (
              <Image
                src={product.thumbnail_url}
                alt={product.name}
                className="mb-4 aspect-video w-full rounded-lg object-cover"
              />
            )}
            <h2 className="text-title-2 font-semibold">{product.name}</h2>
            <p className="mt-2 text-base-content/60">{product.description}</p>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Products.Detail.Pricing)}
            icon={iconsLib.cube}
            className="lg:col-span-2"
          >
            <AdminDetailGrid>
              <AdminDetailField
                label={t(AppLocales.Admin.Products.Table.Code)}
                value={product.code}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Products.Table.Price)}
                value={product.price}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Products.Detail.BillingCycle)}
                value={product.period_label || product.cycle}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Products.Detail.Recurring)}
                value={
                  <StatusBadge
                    status={product.recurring ? "recurring" : "one-time"}
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Products.Detail.Availability)}
                value={
                  <StatusBadge
                    status={product.active ? "active" : "inactive"}
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={formatAdminDate(product.created_at)}
              />
            </AdminDetailGrid>
          </AdminDetailSection>
        </div>
      ) : null}
    </div>
  );
};
