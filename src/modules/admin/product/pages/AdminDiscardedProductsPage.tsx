// src/modules/admin/products/pages/AdminDiscardedProductsPage.tsx
import React from "react";
import { ADMIN_VIEW_MODES } from "../../constants";
import { AdminProductsPage } from "./AdminProductsPage";

export const AdminDiscardedProductsPage: React.FC = () => {
  return <AdminProductsPage view={ADMIN_VIEW_MODES.DISCARDED} />;
};
