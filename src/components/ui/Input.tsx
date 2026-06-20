import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...rest }, ref) => {
    const inputId = id ?? rest.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm text-ink-muted">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`rounded-md border border-border bg-canvas-inset px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:border-accent ${className}`}
          {...rest}
        />
        {error && <span className="text-xs text-critical">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
