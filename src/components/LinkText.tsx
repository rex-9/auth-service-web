import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
interface LinkTextProps {
  label: string;
  to: string;
  className?: string;
}

const LinkText: React.FC<LinkTextProps> = ({ label, to, className }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={to}
      className={clsx(
        "text-primary-light dark:text-primary-dark hover:underline",
        className
      )}
    >
      {t(label)}
    </Link>
  );
};

export default LinkText;
