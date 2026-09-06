import React from "react";
import { Button } from "../../../design/components/button";
import { Badge } from "../../../design/components/common/Badge";
import {
  ButtonSizes,
  ButtonVariants,
  type ButtonVariant,
  BadgeVariants,
} from "../../../design/constants";
import { AppLocales, useTranslate } from "../../../locales";
import { cn } from "../../../design/helpers";

export interface IAdminBatchAction {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: ButtonVariant;
  isDestructive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export interface IAdminBatchActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions: IAdminBatchAction[];
  isLoading?: boolean;
  className?: string;
}

export const AdminBatchActionBar: React.FC<IAdminBatchActionBarProps> = ({
  selectedCount,
  onClearSelection,
  actions,
  isLoading = false,
  className,
}) => {
  const t = useTranslate();

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 bg-base-200/90 backdrop-blur-md border border-base-300 rounded-xl p-3 px-4 shadow-sm animate-in fade-in duration-200",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Badge variant={BadgeVariants.PRIMARY} className="font-semibold">
          {selectedCount}
        </Badge>
        <span className="text-sm font-medium text-base-content">
          {t(AppLocales.Admin.Common.Batch.SelectedCount, {
            count: String(selectedCount),
          })}
        </span>
        <button
          type="button"
          onClick={onClearSelection}
          className="text-xs text-base-content/60 hover:text-base-content underline cursor-pointer ml-1"
        >
          {t(AppLocales.Admin.Common.Batch.ClearSelection)}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const variant =
            action.variant ||
            (action.isDestructive
              ? ButtonVariants.PRIMARY
              : ButtonVariants.SECONDARY);

          return (
            <Button
              key={action.key}
              size={ButtonSizes.SM}
              variant={variant}
              className={
                action.isDestructive
                  ? "!bg-error !text-white hover:!bg-error/90 border-transparent"
                  : ""
              }
              disabled={action.disabled || isLoading}
              onClick={action.onClick}
            >
              {Icon && <Icon className="w-4 h-4 mr-1.5" />}
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBatchActionBar;
