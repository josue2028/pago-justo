import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyInput(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  return `${format(startDate, 'dd MMM yyyy', { locale: es })} — ${format(endDate, 'dd MMM yyyy', {
    locale: es,
  })}`;
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}
