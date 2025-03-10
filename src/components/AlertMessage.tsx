import { FC } from "react";

interface AlertMessageProps {
  type?: "info" | "success" | "warning" | "error";
  message: string;
  className?: string;
}

const AlertMessage: FC<AlertMessageProps> = ({
  type = "info",
  message,
  className = "",
}) => {
  const alertClasses = {
    info: "alert alert-info",
    success: "alert alert-success",
    warning: "alert alert-warning",
    error: "alert alert-error",
  };

  return <div className={`${alertClasses[type]} ${className}`}>{message}</div>;
};

export default AlertMessage;
