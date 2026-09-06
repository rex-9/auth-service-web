// src/modules/admin/users/pages/AdminDiscardedUsersPage.tsx
import React from "react";
import { ADMIN_VIEW_MODES } from "../../constants";
import { AdminUsersPage } from "./AdminUsersPage";

export const AdminDiscardedUsersPage: React.FC = () => {
  return <AdminUsersPage view={ADMIN_VIEW_MODES.DISCARDED} />;
};
