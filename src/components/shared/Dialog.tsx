import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLocalization } from "../../hooks/useLocalization";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}) => {
  const { t, AppLocales } = useLocalization();
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open modal-middle">
      <div className={`modal-box relative ${maxWidth}`}>
        <div className="flex items-center justify-between border-b border-base-300 pb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label={t(AppLocales.COMMON.CLOSE)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
      <div
        className="modal-backdrop bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
    </dialog>
  );
};

export default Dialog;
