import React from "react";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  type?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  startIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  autoComplete?: string;
}
export default function TextInput({
  label,
  placeholder,
  onChange,
  value,
  name,
  type,
  error,
  helperText,
  required,
  startIcon,
  showPasswordToggle,
  autoComplete,
}: TextInputProps) {
  const isRequired = required !== false;
  const inputBaseClass = "peer relative h-12 w-full rounded border px-4 placeholder-transparent outline-none transition-all autofill:bg-white focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
  const inputClass = `${inputBaseClass} ${
    error
      ? "border-red-300 text-red-600 focus:border-red-500"
      : "border-slate-200 text-slate-700 focus:border-emerald-500"
  }`;
  const [show, setShow] = React.useState(false);
  const isPassword = type === "password";
  const computedType = isPassword ? (show ? "text" : "password") : (type || "text");
  return (
    <div className="relative my-6">
      <label className="text-sm">
        {label}
        {isRequired && <span className="text-red-500">*</span>}
        <div className="relative">
          {startIcon ? (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              {startIcon}
            </span>
          ) : null}
          <input
          name={name}
          type={computedType}
          placeholder={placeholder}
          className={`${inputClass} ${startIcon ? 'pl-10' : ''} ${isPassword && showPasswordToggle ? 'pr-10' : ''}`}
          onChange={onChange}
          value={value}
          aria-invalid={!!error}
          autoComplete={autoComplete}
        />
          {isPassword && showPasswordToggle ? (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {/* simple eye icon using SVG to avoid adding new deps if unavailable */}
              {show ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1-2.73 2.67-4.99 4.7-6.47"/><path d="M1 1l22 22"/><path d="M10.58 10.58a2 2 0 1 0 2.83 2.83"/><path d="M16.24 7.76A10.94 10.94 0 0 1 23 12c-.48 1.3-1.2 2.5-2.1 3.57"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          ) : null}
        </div>
      </label>
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
