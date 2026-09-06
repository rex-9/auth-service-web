// src/modules/admin/products/pages/AdminProductEditPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  IAdminProduct,
  IAdminProductFormValues,
} from "../types";
import {
  AlertDialog,
  AdminState,
} from "../../components";
import ProductController from "../product.controller";
import { AdminProductForm } from "./AdminProductForm";
import { ADMIN_ACTIONS } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminProductEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Products.EditTitle)} | Admin`);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [product, setProduct] = useState<IAdminProduct | null>(null);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      const result = await ProductController.getProduct(id);
      setLoading(false);

      if (result.success && result.product) {
        setProduct(result.product);
      } else {
        setError(result.error || t(AppLocales.Admin.Products.Errors.LoadOne));
      }
    };

    void loadProduct();
  }, [id, setLoading, t]);

  const handleSubmit = async (values: IAdminProductFormValues) => {
    if (!id) return;

    setLoading(true, { overlay: false });

    const result = await ProductController.updateProduct(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Products.Toasts.UpdateSuccess));
      navigate(AppRoutes.client.protected.admin.PRODUCTS);
    } else {
      setAlertMessage(result.error || t(AppLocales.Admin.Products.Errors.Update));
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {error && !product ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : product ? (
        <AdminProductForm
          mode={ADMIN_ACTIONS.EDIT}
          product={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate(AppRoutes.client.protected.admin.PRODUCTS)}
        />
      ) : null}
    </>
  );
};

