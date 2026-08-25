import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prefix?: string;
}

export default function Input({ label, hint, prefix, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
            {prefix}
          </span>
        )}
        <input
          className={`w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white dark:bg-slate-800 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
            prefix ? 'pl-7' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
