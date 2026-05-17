import type { HTMLAttributes } from 'react';
import { cn } from '../utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn('rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className)}
      {...props}
    />
  );
}
