import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-canvas hover:bg-accent-muted font-medium',
  secondary: 'bg-canvas-subtle text-ink border border-border hover:border-ink-faint',
  ghost: 'text-ink-muted hover:text-ink hover:bg-canvas-subtle',
  danger: 'bg-canvas-subtle text-critical border border-border hover:border-critical',
};

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
