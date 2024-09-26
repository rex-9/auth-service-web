import React from "react";
import clsx from "clsx";

interface AlertMessageProps {
  message: string;
  type: "success" | "warning" | "error";
  className?: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type,
  className,
}) => {
  let colorClass = "";

  switch (type) {
    case "success":
      colorClass = "text-text-success-light dark:text-text-success-dark";
      break;
    case "warning":
      colorClass = "text-text-warning-light dark:text-text-warning-dark";
      break;
    case "error":
      colorClass = "text-text-error-light dark:text-text-error-dark";
      break;
    default:
      colorClass = "text-text-error-light dark:text-text-error-dark";
  }

  return <p className={clsx(colorClass, "mb-4", className)}>{message}</p>;
};

export default AlertMessage;
