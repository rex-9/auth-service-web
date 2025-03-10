import { FC } from "react";
import { Link, LinkProps } from "react-router-dom";
import { useLocalization } from "../hooks";

interface TextLinkProps extends LinkProps {
  label?: string;
  variant?: "default" | "ghost";
}

const TextLink: FC<TextLinkProps> = ({
  label,
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const { t } = useLocalization();

  const variantClasses = {
    default: "link link-primary",
    ghost: "link link-hover",
  };

  return (
    <Link className={`${variantClasses[variant]} ${className}`} {...props}>
      {label ? t(label) : children}
    </Link>
  );
};

export default TextLink;
