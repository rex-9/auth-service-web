import React from "react";
import { Link } from "react-router-dom";
import { clsx } from "ts-clsx";
import { useLocalization } from "../hooks";

interface TextLinkProps {
  label: string;
  to: string;
  className?: string;
}

const LinkText: React.FC<TextLinkProps> = ({ label, to, className }) => {
  const { t } = useLocalization();

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
