// src/design/components/form/FileInput.tsx

import React, { useRef } from "react";
import { cn } from "../../helpers";
import { Button } from "../button";
import { ButtonVariants, ComponentSizes } from "../../constants";

export interface IFileInputProps {
  label?: string;
  accept?: string;
  buttonText?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  multiple?: boolean;
  onChange?: (file: File | null) => void;
  onFilesChange?: (files: File[]) => void;
}

export const FileInput: React.FC<IFileInputProps> = ({
  label,
  accept,
  buttonText = "Choose File",
  helperText,
  error,
  disabled = false,
  fullWidth = true,
  className,
  multiple = false,
  onChange,
  onFilesChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasError = !!error;
  const displayText = error || helperText;

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (onFilesChange) {
      onFilesChange(files);
    }
    if (onChange) {
      onChange(files.length > 0 ? files[0] : null);
    }
    e.target.value = "";
  };

  return (
    <div
      className={cn("flex flex-col gap-1", fullWidth && "w-full", className)}
    >
      {label && (
        <span className="text-body-s font-medium text-base-content">
          {label}
        </span>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      <Button
        variant={ButtonVariants.SECONDARY}
        size={ComponentSizes.MD}
        disabled={disabled}
        onClick={handleClick}
        className="w-full sm:w-auto"
      >
        {buttonText}
      </Button>

      {displayText && (
        <span
          className={cn(
            "text-xs transition-colors duration-200",
            hasError ? "text-error font-medium" : "text-base-content/60",
          )}
        >
          {displayText}
        </span>
      )}
    </div>
  );
};
