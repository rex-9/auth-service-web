import { FC, InputHTMLAttributes } from "react";
import { clsx } from "ts-clsx";
import { useLocalization } from "../../hooks";

type BaseFormInputProps = {
  id: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  required?: boolean;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

type FloatingFormInputProps = BaseFormInputProps & {
  floating: true;
  label: string; // Label is required when floating is true
};

type NonFloatingFormInputProps = BaseFormInputProps & {
  floating?: false;
  label?: string; // Label is optional when floating is false or undefined
};

type FormInputProps = FloatingFormInputProps | NonFloatingFormInputProps;

const FormInput: FC<FormInputProps> = ({
  id,
  label,
  error,
  containerClassName = "",
  inputClassName = "",
  floating,
  required,
  hint,
  ...props
}) => {
  const { t } = useLocalization();

  return (
    <div
      className={clsx(
        "form-control w-full",
        floating && "relative",
        containerClassName
      )}
    >
      {!floating && label && (
        <label htmlFor={id} className="label">
          <span className="label-text">
            {t(label)} {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <input
        id={id}
        placeholder={floating ? t(label) : props.placeholder}
        className={clsx(
          "input input-bordered w-full",
          floating &&
            "placeholder:text-transparent focus:placeholder:text-inherit peer",
          inputClassName
        )}
        {...props}
      />
      {floating && (
        <label
          htmlFor={id}
          className="absolute -top-3 left-3 -translate-y-0 scale-75 bg-base-100 px-1 text-sm transition-all
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:scale-100 peer-focus:-top-3 peer-focus:-translate-y-0
            peer-focus:scale-75 peer-focus:px-1"
        >
          {t(label)}
        </label>
      )}
      {(error || hint) && (
        <label className="label">
          <span
            className={`label-text-alt ${
              error ? "text-error" : "text-base-content/70"
            }`}
          >
            {error || hint}
          </span>
        </label>
      )}
    </div>
  );
};

export default FormInput;
