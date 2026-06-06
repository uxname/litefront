import { cn } from "@shared/lib/cn";
import { FC, ReactNode } from "react";

export interface FormFieldProps {
  /** id of the control this field labels (also drives error/hint aria ids). */
  htmlFor: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Label + control + hint/error wrapper. The control (child) should wire
 * `id={htmlFor}` and `aria-describedby={`${htmlFor}-error`}` itself.
 */
export const FormField: FC<FormFieldProps> = ({
  htmlFor,
  label,
  hint,
  error,
  required,
  className,
  children,
}) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    {children}
    {error ? (
      <p id={`${htmlFor}-error`} className="text-xs font-medium text-red-600">
        {error}
      </p>
    ) : (
      hint && <p className="text-xs text-slate-400">{hint}</p>
    )}
  </div>
);
