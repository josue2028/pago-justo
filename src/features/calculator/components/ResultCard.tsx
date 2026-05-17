import { useEffect, useState } from 'react';
import { Card } from '@core/ui';
import { formatCurrency } from '@core/utils/formatters';

interface ResultCardProps {
  label: string;
  value: number;
  subtitle: string;
  variant?: 'primary' | 'secondary' | 'warning';
}

const variantClasses = {
  primary: 'border-brand-blue/20 bg-brand-blue/5',
  secondary: 'border-brand-yellow/20 bg-brand-yellow/10',
  warning: 'border-brand-warning/20 bg-brand-warning/10',
};

export function ResultCard({
  label,
  value,
  subtitle,
  variant = 'primary',
}: ResultCardProps): JSX.Element {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 450;

    const frame = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [value]);

  return (
    <Card className={variantClasses[variant]}>
      <p className="text-sm text-brand-muted">{label}</p>
      <p className="mt-3 text-2xl font-bold text-brand-text">{formatCurrency(displayValue)}</p>
      <p className="mt-2 text-sm text-brand-muted">{subtitle}</p>
    </Card>
  );
}
