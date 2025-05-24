import { useAtom } from "jotai";
import atoms from "../atoms";
import { Toast, ToastType } from "../models/Toast";

export const useToast = () => {
  const [, setToasts] = useAtom(atoms.toastsAtom);

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration = 3000
  ) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };

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
    success: (message: string, duration?: number) =>
      showToast(message, "success", duration),
    error: (message: string, duration?: number) =>
      showToast(message, "error", duration),
    info: (message: string, duration?: number) =>
      showToast(message, "info", duration),
    warning: (message: string, duration?: number) =>
      showToast(message, "warning", duration),
    dismissToast,
    dismissAllToasts,
  };
};
