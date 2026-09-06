// src/modules/admin/products/pages/AdminProductCreatePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { IAdminProductFormValues } from "../types";
import ProductController from "../product.controller";
import { AdminProductForm } from "./AdminProductForm";
import { AlertDialog } from "../../components";
import { ADMIN_ACTIONS } from "../../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminProductCreatePage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Products.CreateTitle)} | Admin`);

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (values: IAdminProductFormValues) => {
    setLoading(true, { overlay: false });

    const result = await ProductController.createProduct(values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Products.Toasts.CreateSuccess));
      navigate(AppRoutes.client.protected.admin.PRODUCTS, {
        replace: true,
      });
    } else {
      setAlertMessage(result.error || t(AppLocales.Admin.Products.Errors.Create));
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      <AdminProductForm
        mode={ADMIN_ACTIONS.CREATE}
        onSubmit={handleSubmit}
        onCancel={() => navigate(AppRoutes.client.protected.admin.PRODUCTS)}
      />
    </>
  );
};

