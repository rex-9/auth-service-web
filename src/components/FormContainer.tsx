import React from "react";
import { clsx } from "ts-clsx";
import { useLocalization } from "../hooks";

interface FormContainerProps {
  title: string;
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
  const { t } = useLocalization();

  return (
    <form
      onSubmit={onSubmit}
      className={clsx(
        "w-96 flex flex-col justify-center items-center bg-white dark:bg-gray-800 p-6 rounded shadow-md",
        className
      )}
    >
      <h2 className="text-2xl mb-4">{t(title)}</h2>
      {children}
    </form>
  );
};

export default FormContainer;
