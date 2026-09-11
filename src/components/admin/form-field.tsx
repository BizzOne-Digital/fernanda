import { cn } from "@/lib/utils/cn";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ label, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-sm font-medium text-ink/80">
        {label}
        {required ? <span className="ml-0.5 text-golden">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-ink/50">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export const adminInputClass =
  "w-full rounded-lg border border-sand/60 bg-white/90 px-3 py-2 text-sm text-ink shadow-sm placeholder:text-ink/35 focus:border-lake-medium focus:outline-none focus:ring-2 focus:ring-lake-medium/20 disabled:opacity-50";

export const adminTextareaClass = cn(adminInputClass, "min-h-[100px] resize-y");
export const adminSelectClass = adminInputClass;

type AdminInputProps = InputHTMLAttributes<HTMLInputElement> & { error?: boolean };

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(adminInputClass, error && "border-red-300 focus:border-red-400 focus:ring-red-200", className)}
      {...props}
    />
  ),
);
AdminInput.displayName = "AdminInput";

type AdminTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean };

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(adminTextareaClass, error && "border-red-300 focus:border-red-400 focus:ring-red-200", className)}
      {...props}
    />
  ),
);
AdminTextarea.displayName = "AdminTextarea";

type AdminSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean };

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(adminSelectClass, error && "border-red-300 focus:border-red-400 focus:ring-red-200", className)}
      {...props}
    >
      {children}
    </select>
  ),
);
AdminSelect.displayName = "AdminSelect";
