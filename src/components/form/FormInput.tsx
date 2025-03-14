import { FC, InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "ts-clsx";
import { useLocalization } from "../../hooks";
import Asset from "../Asset";
import assets from "../../assets";

type BaseFormInputProps = {
  id: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  required?: boolean;
  hint?: string;
  label: string;
  suffixIcon?: ReactNode;
  onSuffixIconClick?: () => void;
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput: FC<BaseFormInputProps> = ({
  id,
  label,
  error,
  containerClassName = "",
  inputClassName = "",
  required,
  hint,
  suffixIcon,
  onSuffixIconClick,
  ...props
}) => {
  const { t } = useLocalization();

  return (
    <div className="form-control w-full mb-2">
      <div className={clsx("relative", containerClassName)}>
        <input
          id={id}
          placeholder={props.placeholder}
          required={required}
          className={clsx(
            "input input-bordered w-full h-12",
            "placeholder:text-transparent focus:placeholder:text-gray-400 peer",
            "focus:outline-none focus:ring-0",
            suffixIcon && "pr-10",
            "[:not(:placeholder-shown):invalid]:input-error focus-within:invalid:input-error",
            inputClassName
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute -top-3 left-3 scale-75 bg-base-100 px-1 text-sm transition-all
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:scale-100 peer-focus:-top-3 peer-focus:left-0 peer-focus:-translate-y-0
            peer-focus:scale-75"
        >
          {t(label)}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        {suffixIcon && (
          <button
            type="button"
            onClick={onSuffixIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-base-content/70 hover:text-base-content transition-colors
              opacity-0 peer-[:not(:placeholder-shown)]:opacity-100"
          >
            {suffixIcon}
          </button>
        )}
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-xs text-error">{error}</span>
        </label>
      )}
      {hint && (
        <label className="label">
          <span className="label-text-alt text-xs text-base-content/70 flex items-center gap-1">
            <Asset
              className="w-3 h-3"
              asset={assets.icons.asset.tipLightBulb}
            />
            {hint}
          </span>
        </label>
      )}
    </div>
  );
};

export default FormInput;
