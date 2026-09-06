// src/design/components/form/PasswordInput.tsx

import React, { useRef, useEffect } from "react";

export interface IPasswordInputProps {
  idPrefix: string;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  label: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  mask?: boolean;
  showSeparator?: boolean;
}

export const PasswordInput: React.FC<IPasswordInputProps> = ({
  idPrefix,
  value,
  onChange,
  onComplete,
  label,
  helperText,
  error,
  disabled = false,
  autoFocus = true,
  mask = true,
  showSeparator = false,
}) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] || "");
  const displayText = error || helperText;
  const hasError = !!error;

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (value.length === 6 && onComplete && !disabled) {
      onComplete(value);
    }
  }, [value, onComplete, disabled]);

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus && !disabled && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const updateDigit = (index: number, nextValue: string) => {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    const merged = nextDigits.join("").slice(0, 6);
    onChange(merged);

    // Move to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Backspace: clear current if filled, or move to previous input if empty
    if (event.key === "Backspace") {
      if (digits[index]) {
        updateDigit(index, "");
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    // Left arrow
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    // Right arrow
    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    startIndex: number,
  ) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6 - startIndex);

    if (!pasted) return;

    const nextDigits = [...digits];
    pasted.split("").forEach((digit, offset) => {
      nextDigits[startIndex + offset] = digit;
    });

    onChange(nextDigits.join("").slice(0, 6));

    const nextFocusIndex = Math.min(startIndex + pasted.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing to allow quick re-entry
    inputRefs.current[index]?.select();
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-body-s font-medium text-base-content mb-2 text-center">
          {label}
        </label>
      )}

      <div className="flex items-center justify-center gap-2">
        {digits.map((digit, index) => (
          <React.Fragment key={`${idPrefix}-${index}`}>
            <input
              id={`${idPrefix}-${index}`}
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              value={mask && digit ? "*" : digit}
              maxLength={1}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={(event) => handlePaste(event, index)}
              onFocus={() => handleFocus(index)}
              disabled={disabled}
              aria-label={`${label || "Passcode"} digit ${index + 1}`}
              className={`
                w-12 h-14
                rounded-xl border-2 text-center
                caret-primary transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary
                ${
                  mask && digit
                    ? "font-sans font-bold text-2xl sm:text-3xl text-white tracking-normal pt-1"
                    : "font-primary font-semibold text-xl text-base-content tracking-wider pt-0"
                }
                ${
                  hasError
                    ? "border-error focus:border-error focus:ring-error"
                    : "border-base-300 hover:border-base-content/30 focus:border-primary"
                }
                ${
                  disabled
                    ? "opacity-50 cursor-not-allowed bg-base-300"
                    : "bg-base-200"
                }
              `}
            />
            {showSeparator && index === 2 && (
              <span className="text-body-l font-semibold text-base-content opacity-70 px-1">
                -
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {displayText && (
        <span
          className={`
            text-caption mt-4
            ${hasError ? "text-error" : "text-base-content opacity-60"}
          `}
        >
          {displayText}
        </span>
      )}
    </div>
  );
};
