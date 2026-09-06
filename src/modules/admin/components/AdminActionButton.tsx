import React from "react";
import type { AdminAction, AdminResource } from "../role";
import { Button, IButtonProps } from "../../../design/components/button/Button";
import { usePermissions } from "../../../hooks";

interface IAdminActionButtonProps extends IButtonProps {
  action: AdminAction;
  resource: AdminResource;
}

export const AdminActionButton: React.FC<IAdminActionButtonProps> = ({
  action,
  resource,
  children,
  ...props
}) => {
  const { can } = usePermissions();

  if (!can(action, resource)) return null;

  return <Button {...props}>{children}</Button>;
};
