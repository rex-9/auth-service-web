import { XMarkIcon } from "@heroicons/react/24/outline";
import { Toast, ToastType } from "../../models/Toast";

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  const { message, type } = toast;

  const alertClasses: Record<ToastType, string> = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
  };

  return (
    <div className={`alert ${alertClasses[type]} shadow-lg`}>
      <div>
        <span>{message}</span>
      </div>
      <div className="flex-none">
        <button onClick={onDismiss} className="btn btn-ghost btn-sm">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ToastItem;
