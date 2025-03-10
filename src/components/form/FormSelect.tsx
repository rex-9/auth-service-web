import React from "react";
import { IAsset } from "../../assets";

interface SelectOption {
  value: string;
  label?: string;
  icon?: IAsset;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name?: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  hint?: string;
  multiple?: boolean;
  defaultValue?: string | string[];
  icon?: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  error,
  required = false,
  options,
  hint,
  icon,
  ...props
}) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
            {icon}
          </div>
        )}
        <select
          name={name}
          className={`select select-bordered w-full ${icon ? "pl-10" : ""} ${
            error ? "select-error" : ""
          }`}
          {...props}
          multiple={props.multiple}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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

export default FormSelect;
