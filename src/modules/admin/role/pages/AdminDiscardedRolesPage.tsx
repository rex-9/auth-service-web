// src/modules/admin/roles/pages/AdminDiscardedRolesPage.tsx
import React from "react";
import { ADMIN_VIEW_MODES } from "../../constants";
import { AdminRolesPage } from "./AdminRolesPage";

export const AdminDiscardedRolesPage: React.FC = () => {
  return <AdminRolesPage view={ADMIN_VIEW_MODES.DISCARDED} />;
};
