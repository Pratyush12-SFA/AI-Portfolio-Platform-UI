import React, { useId } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function InputField({
  label,
  error,
  className = "",
  id,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="space-y-1.5 text-left w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[10px] text-ascend-text-secondary uppercase font-semibold tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-input border border-ascend-border bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-ascend-primary focus-ring-ascend font-sans transition-colors placeholder:text-ascend-text-muted ${
          error ? "border-ascend-danger focus:border-ascend-danger" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="block text-[10px] font-semibold text-ascend-danger">
          {error}
        </span>
      )}
    </div>
  );
}
