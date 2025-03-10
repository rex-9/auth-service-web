import React from "react";
import { clsx } from "ts-clsx";
import { useTranslation } from "react-i18next";

interface FormContainerProps {
  title?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  children,
  onSubmit,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={onSubmit}
      className={clsx(
        "w-96 flex flex-col justify-center items-center bg-base-100 p-6 rounded shadow-md",
        className
      )}
    >
      {title && <h2 className="text-2xl">{t(title)}</h2>}
      {children}
    </form>
  );
};

export default FormContainer;
