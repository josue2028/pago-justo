import { forwardRef } from 'react';
import { formatCurrencyInput } from '@core/utils/formatters';
import { parseCurrencyInput } from '@core/utils/validators';
import { cn } from '../utils';

interface CurrencyInputProps {
  id: string;
  value: number;
  onValueChange: (value: number) => void;
  onBlur?: () => void;
  ariaDescribedBy?: string;
  hasError?: boolean;
  label: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  { id, value, onValueChange, onBlur, ariaDescribedBy, hasError = false, label },
  ref,
) {
  return (
    <div
      className={cn(
        'flex min-h-11 w-full items-center rounded-2xl border bg-white pl-4 pr-3 text-sm text-brand-text transition',
        hasError
          ? 'border-brand-error focus-within:ring-2 focus-within:ring-brand-error/20'
          : 'border-slate-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20',
      )}
    >
      <span
        aria-hidden="true"
        className="pr-2 font-semibold text-brand-muted"
      >
        $
      </span>
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode="numeric"
        aria-label={label}
        aria-describedby={ariaDescribedBy}
        className="w-full border-0 bg-transparent py-3 outline-none"
        value={formatCurrencyInput(Math.max(value, 0))}
        onBlur={onBlur}
        onChange={(event) => onValueChange(parseCurrencyInput(event.target.value))}
      />
    </div>
  );
});
