import React from "react";

interface FormSwitchProps {
  label: string;
  name: string;
  checked?: boolean;
  error?: string;
  hint?: string;
  onChange?: (checked: boolean) => void;
}

const FormSwitch: React.FC<FormSwitchProps> = ({
  label,
  name,
  checked = false,
  error,
  hint,
  onChange,
}) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer justify-start gap-4">
        <input
          type="checkbox"
          name={name}
          className="toggle toggle-primary"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="label-text">{label}</span>
      </label>
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

export default FormSwitch;
