import React, { useState } from "react";
import { Button } from "../../../design/components/button";
import { ButtonSizes, ButtonVariants } from "../../../design/constants";
import { iconsLib } from "../../../assets";
import { ConfirmDialog } from "../../../design/components/overlay";
import { AppLocales, useTranslate } from "../../../locales";

import { cn } from "../../../design/helpers";

export interface IAdminEmptyRecycleBinButtonProps {
  onConfirm: () => Promise<void> | void;
  count?: number;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const AdminEmptyRecycleBinButton: React.FC<
  IAdminEmptyRecycleBinButtonProps
> = ({ onConfirm, count, disabled = false, isLoading = false, className }) => {
  const t = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = isLoading || submitting;

  return (
    <>
      <Button
        variant={ButtonVariants.PRIMARY}
        size={ButtonSizes.SM}
        disabled={disabled || isBusy || (count !== undefined && count <= 0)}
        onClick={() => setIsOpen(true)}
        className={cn(
          "!bg-error !text-white hover:!bg-error/90 border-transparent",
          className,
        )}
        title={t(AppLocales.Admin.Common.RecycleBin.EmptyTitle)}
      >
        <iconsLib.trash className="w-4 h-4 mr-1.5" />
        {t(AppLocales.Admin.Common.RecycleBin.EmptyButton)}
        {count !== undefined && count > 0 ? ` (${count})` : ""}
      </Button>

      <ConfirmDialog
        isOpen={isOpen}
        title={t(AppLocales.Admin.Common.RecycleBin.ConfirmEmptyTitle)}
        message={t(AppLocales.Admin.Common.RecycleBin.ConfirmEmptyMessage, {
          count: count !== undefined ? String(count) : "",
        })}
        confirmLabel={t(AppLocales.Admin.Common.RecycleBin.EmptyButton)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleConfirm}
        onClose={() => setIsOpen(false)}
        isLoading={isBusy}
        isDestructive
      />
    </>
  );
};

export default AdminEmptyRecycleBinButton;
