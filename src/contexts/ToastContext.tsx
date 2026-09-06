import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { translate } from "../locales";
import { Toast, TToastType } from "../design/components/overlay/Toast";

interface IToastContextType {
  showToast: (type: TToastType, message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<IToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    type: TToastType;
    message: string;
    title?: string;
  } | null>(null);

  const showToast = useCallback(
    (type: TToastType, message: string, title?: string) => {
      setToast({ type, message: translate(message), title });
    },
    [],
  );

  const success = useCallback(
    (message: string, title?: string) => showToast("success", message, title),
    [showToast],
  );
  const error = useCallback(
    (message: string, title?: string) => showToast("error", message, title),
    [showToast],
  );
  const info = useCallback(
    (message: string, title?: string) => showToast("info", message, title),
    [showToast],
  );
  const warning = useCallback(
    (message: string, title?: string) => showToast("warning", message, title),
    [showToast],
  );

  const value = useMemo(
    () => ({ showToast, success, error, info, warning }),
    [showToast, success, error, info, warning],
  );

  const toastElement = toast ? (
    <Toast
      type={toast.type}
      message={toast.message}
      title={toast.title}
      onClose={() => setToast(null)}
    />
  ) : null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toastElement &&
        (typeof document !== "undefined"
          ? createPortal(toastElement, document.body)
          : toastElement)}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
