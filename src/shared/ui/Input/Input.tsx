import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'min-h-11 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-brand-text outline-none transition',
        hasError
          ? 'border-brand-error focus:ring-2 focus:ring-brand-error/20'
          : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20',
        className,
      )}
      {...props}
    />
  );
});
