// src/modules/admin/asset/pages/AdminDiscardedAssetsPage.tsx
import React from "react";
import { ADMIN_VIEW_MODES } from "../../constants";
import { AdminAssetsPage } from "./AdminAssetsPage";

export const AdminDiscardedAssetsPage: React.FC = () => {
  return <AdminAssetsPage view={ADMIN_VIEW_MODES.DISCARDED} />;
};
