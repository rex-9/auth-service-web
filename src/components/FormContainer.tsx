import React from "react";
import clsx from "clsx";

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
  return (
    <form
      onSubmit={onSubmit}
      className={clsx(
        "w-96 flex flex-col justify-center items-center bg-white dark:bg-gray-800 p-6 rounded shadow-md",
        className
      )}
    >
      <h2 className="text-2xl mb-4">{title}</h2>
      {children}
    </form>
  );
};

export default FormContainer;
