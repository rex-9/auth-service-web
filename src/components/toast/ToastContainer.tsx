import { useAtom } from "jotai";
import { useEffect } from "react";
import atoms from "../../atoms";
import { Toast } from "../../models/Toast";
import { ToastItem } from ".";

const ToastContainer = () => {
  const [toasts, setToasts] = useAtom<Toast[]>(atoms.toastsAtom);

  // Remove toasts after their duration expires
  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) => {
      const duration = toast.duration || 3000; // Default 3 seconds
      return setTimeout(() => {
        setToasts((currentToasts: Toast[]) =>
          currentToasts.filter((t) => t.id !== toast.id)
        );
      }, duration);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, setToasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => {
            setToasts((currentToasts) =>
              currentToasts.filter((t) => t.id !== toast.id)
            );
          }}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
