import { useAtom } from "jotai";
import atoms from "../atoms";
import { Toast, ToastType } from "../models/Toast";

export const useToast = () => {
  const [, setToasts] = useAtom(atoms.toastsAtom);

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration = 3000,
    logDetails?: any
  ) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };

    // Log to console based on toast type
    if (type === "error") {
      console.error(`[ERROR] ${message}`, logDetails || "");
    } else if (type === "warning") {
      console.warn(`[WARNING] ${message}`, logDetails || "");
    } else if (process.env.NODE_ENV !== "production") {
      // Only log info and success in development
      console.log(`[${type.toUpperCase()}] ${message}`, logDetails || "");
    }

    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const dismissAllToasts = () => {
    setToasts([]);
  };

  return {
    showToast,
    success: (message: string, duration?: number, logDetails?: any) =>
      showToast(message, "success", duration, logDetails),
    error: (message: string, duration?: number, logDetails?: any) =>
      showToast(message, "error", duration, logDetails),
    info: (message: string, duration?: number, logDetails?: any) =>
      showToast(message, "info", duration, logDetails),
    warning: (message: string, duration?: number, logDetails?: any) =>
      showToast(message, "warning", duration, logDetails),
    dismissToast,
    dismissAllToasts,
  };
};
