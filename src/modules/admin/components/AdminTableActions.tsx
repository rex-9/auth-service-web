import React from "react";
import type { AdminAction, AdminResource } from "../role";
import { cn } from "../../../design/helpers";
import { ButtonSizes, ButtonVariants } from "../../../design/constants";
import {
  ADMIN_ACTION_CATEGORIES,
  ADMIN_ACTIONS,
  type TAdminActionCategory,
  type TAdminActionsType,
} from "../constants";
import { AdminActionButton } from "./AdminActionButton";
import { useTranslate, AppLocales } from "../../../locales";
import { iconsLib } from "../../../assets";

export interface IAdminTableAction {
  disabled?: boolean;
  type: TAdminActionsType;
  onClick: () => void;
}

export interface IAdminTableActionConfig {
  action: AdminAction;
  labelKey: string;
  category: TAdminActionCategory;
  icon: React.ComponentType<{ className?: string }>;
}

const ADMIN_TABLE_ACTION_CONFIG: Record<string, IAdminTableActionConfig> = {
  [ADMIN_ACTIONS.EDIT]: {
    action: ADMIN_ACTIONS.UPDATE,
    labelKey: AppLocales.Admin.Common.Actions.Edit,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
    icon: iconsLib.pencilSquare,
  },
  [ADMIN_ACTIONS.REVIEW]: {
    action: ADMIN_ACTIONS.UPDATE,
    labelKey: AppLocales.Admin.Common.Actions.Review,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
    icon: iconsLib.eye,
  },
  [ADMIN_ACTIONS.INSPECT]: {
    action: ADMIN_ACTIONS.READ,
    labelKey: AppLocales.Admin.Common.Actions.Inspect,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
    icon: iconsLib.eye,
  },
  [ADMIN_ACTIONS.EXTEND]: {
    action: ADMIN_ACTIONS.UPDATE,
    labelKey: AppLocales.Admin.Common.Actions.Extend,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
    icon: iconsLib.clock,
  },
  [ADMIN_ACTIONS.DELETE]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Discard,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
    icon: iconsLib.trash,
  },
  [ADMIN_ACTIONS.DESTROY]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Destroy,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
    icon: iconsLib.trash,
  },
  [ADMIN_ACTIONS.DISCARD]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Discard,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
    icon: iconsLib.trash,
  },
  [ADMIN_ACTIONS.REVOKE]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Revoke,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
    icon: iconsLib.trash,
  },
  [ADMIN_ACTIONS.UNDISCARD]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Restore,
    category: ADMIN_ACTION_CATEGORIES.SUCCESS,
    icon: iconsLib.arrowPath,
  },
};

interface IAdminTableActionsProps {
  actions: IAdminTableAction[];
  resource: AdminResource;
}

export const AdminTableActions: React.FC<IAdminTableActionsProps> = ({
  actions,
  resource,
}) => {
  const t = useTranslate();

  return (
    <div className="flex items-center justify-end gap-1.5">
      {actions.map(({ disabled, type, onClick }) => {
        const config = ADMIN_TABLE_ACTION_CONFIG[type] ?? {
          action: ADMIN_ACTIONS.UPDATE,
          labelKey: String(type),
          category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
          icon: iconsLib.pencilSquare,
        };

        const label = config.labelKey.includes(".")
          ? t(config.labelKey)
          : config.labelKey;

        const categoryStyles: Record<TAdminActionCategory, string> = {
          [ADMIN_ACTION_CATEGORIES.NEUTRAL]:
            "border border-base-300 bg-base-100 text-base-content/70 hover:text-base-content hover:bg-base-200 hover:border-base-400 active:bg-base-300",
          [ADMIN_ACTION_CATEGORIES.DANGER]:
            "border border-error/30 bg-error/5 text-error hover:bg-error/15 hover:border-error active:bg-error/25",
          [ADMIN_ACTION_CATEGORIES.SUCCESS]:
            "border border-success/30 bg-success/5 text-success hover:bg-success/15 hover:border-success active:bg-success/25",
        };

        const Icon = config.icon;

        return (
          <AdminActionButton
            key={type}
            action={config.action}
            resource={resource}
            size={ButtonSizes.SM}
            variant={ButtonVariants.TERTIARY}
            className={cn(
              "h-8 w-8 p-0 flex items-center justify-center rounded-lg transition-all duration-150 shadow-none border shrink-0",
              categoryStyles[config.category],
            )}
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={onClick}
          >
            {Icon ? <Icon className="w-4 h-4 shrink-0" /> : label}
          </AdminActionButton>
        );
      })}
    </div>
  );
};

