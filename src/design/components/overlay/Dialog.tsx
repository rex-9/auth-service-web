/**
 * Rexone Design System - Dialog Molecule (DaisyUI Native Modal)
 *
 * Rounded 20-24px, dimmed background with slight vignette
 */

import React, { useEffect } from "react";
import { iconsLib } from "../../../assets";
import { cn } from "../../helpers";

export interface IDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<IDialogProps> = ({
  isOpen,
  onClose,
  onBack,
  title,
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn("modal modal-open z-50 transition-opacity duration-200")}
    >
      <div
        className={cn(
          "modal-box relative z-10 bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xl",
          "w-full max-w-md max-h-[90dvh] overflow-y-auto font-primary",
          className,
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {/* Back Button (left side) */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-base-200 text-base-content/70 hover:text-base-content transition-colors -ml-1 flex items-center justify-center cursor-pointer"
              aria-label="Back"
            >
              <iconsLib.chevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Title (center, optional) */}
          {title && (
            <h3 className="text-xl font-bold font-primary text-base-content flex-1 text-center">
              {title}
            </h3>
          )}

          {/* Spacer when no back button & no title */}
          {!onBack && !title && <div className="flex-1" />}

          {/* Close Button (right side) */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-base-200 text-base-content/70 hover:text-base-content transition-colors ml-auto -mr-1 flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <iconsLib.close className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-base-300">
            {footer}
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div
        className="modal-backdrop bg-black/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
};

export default Dialog;
