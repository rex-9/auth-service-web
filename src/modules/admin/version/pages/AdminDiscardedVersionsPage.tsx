import React from "react";
import { ADMIN_VIEW_MODES } from "../../constants";
import { AdminVersionsPage } from "./AdminVersionsPage";

export const AdminDiscardedVersionsPage: React.FC = () => {
  return <AdminVersionsPage view={ADMIN_VIEW_MODES.DISCARDED} />;
};
