/**
 * Rexone Design System - Toast Notification
 * Uses DaisyUI alert components with consistent iconsLib icons
 */

import React, { useEffect } from "react";
import { iconsLib } from "../../../assets";
import { cn } from "../../helpers";
import { ToastTypes, type TToastType } from "../../constants";

export { ToastTypes };
export type { TToastType };

export interface IToastProps {
  message: string;
  type?: TToastType;
  duration?: number;
  onClose: () => void;
  icon?: React.ReactNode;
  title?: string;
}

export const Toast: React.FC<IToastProps> = ({
  message,
  type = ToastTypes.SUCCESS,
  duration = 5000,
  onClose,
  icon,
  title,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeClasses = {
    success: "alert-success",
    info: "alert-info",
    warning: "alert-warning",
    error: "alert-error",
  };

  const defaultIcons = {
    success: (
      <iconsLib.check className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
    ),
    info: (
      <iconsLib.info className="h-6 w-6 text-sky-600 dark:text-sky-400 shrink-0" />
    ),
    warning: (
      <iconsLib.warning className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
    ),
    error: (
      <iconsLib.error className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" />
    ),
  };

  const typeColors = {
    success: "text-emerald-800 dark:text-emerald-200",
    info: "text-sky-800 dark:text-sky-200",
    warning: "text-amber-800 dark:text-amber-200",
    error: "text-rose-800 dark:text-rose-200",
  };

  return (
    <div className="toast toast-top toast-center z-[9999] animate-fade-in">
      <div
        className={cn(
          "alert shadow-lg max-w-md border border-base-300",
          typeClasses[type],
        )}
      >
        <div className="flex items-start gap-3 w-full">
          <div className="mt-0.5">{icon || defaultIcons[type]}</div>
          <div className="flex-1 min-w-0">
            {title && (
              <p className={cn("text-body-s font-semibold", typeColors[type])}>
                {title}
              </p>
            )}
            <p className="text-body-s">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-square flex-shrink-0 opacity-70 hover:opacity-100"
            aria-label="Close alert"
          >
            <iconsLib.close className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
