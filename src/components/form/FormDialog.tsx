import React from "react";
import { Button, Dialog } from "../index";
import { useLoading } from "../../contexts/LoadingContext";
import { useLocalization } from "../../hooks/useLocalization";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: any) => Promise<void>;
  children: React.ReactNode;
  maxWidth?: string;
}

const FormDialog: React.FC<FormDialogProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  maxWidth,
}) => {
  const { isLoading } = useLoading();
  const { t, AppLocales } = useLocalization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    await onSubmit(data);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} maxWidth={maxWidth}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="ghost"
            label={t(AppLocales.COMMON.CANCEL)}
            onClick={onClose}
          />
          <Button
            type="submit"
            variant="primary"
            label={t(AppLocales.COMMON.SAVE)}
            disabled={isLoading}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialog;
