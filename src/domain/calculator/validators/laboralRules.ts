import { CURRENT_LEGAL_RATES } from '../constants/colombiaRates';
import type { CalculatorInput } from '../types/calculator.types';

export interface PeriodMetrics {
  workingDays: number;
  periodRatio: number;
}

export function getPeriodMetrics(startDate: Date, endDate: Date): PeriodMetrics {
  const startUtc = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
  const endUtc = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
  const workingDays = Math.round((endUtc - startUtc) / 86400000) + 1;
  const safeDays = Math.max(workingDays, 1);
  const isFullMonth =
    startDate.getUTCDate() === 1 &&
    startDate.getUTCMonth() === endDate.getUTCMonth() &&
    startDate.getUTCFullYear() === endDate.getUTCFullYear() &&
    endDate.getUTCDate() ===
      new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() + 1, 0)).getUTCDate();

  return {
    workingDays: safeDays,
    periodRatio: isFullMonth ? 1 : safeDays / 30,
  };
}

export function calculateTransportAllowance(baseSalary: number, includesTransportAllowance: boolean): number {
  if (!includesTransportAllowance) {
    return 0;
  }

  if (baseSalary > CURRENT_LEGAL_RATES.SMMLV * 2) {
    return 0;
  }

  return CURRENT_LEGAL_RATES.AUXILIO_TRANSPORTE;
}

export function getMinimumIbc(input: Pick<CalculatorInput, 'role' | 'contractType'>): number {
  if (input.role === 'CONTRATISTA_INDEPENDIENTE') {
    return CURRENT_LEGAL_RATES.SMMLV * CURRENT_LEGAL_RATES.IBC_MINIMO_SALUD;
  }

  if (input.contractType === 'MEDIO_TIEMPO') {
    return CURRENT_LEGAL_RATES.SMMLV * CURRENT_LEGAL_RATES.IBC_MINIMO_MEDIO_TIEMPO;
  }

  return CURRENT_LEGAL_RATES.SMMLV * CURRENT_LEGAL_RATES.IBC_MINIMO_SALUD;
}

export function clampIbc(ibc: number, minimumIbc: number): number {
  const maximumIbc = CURRENT_LEGAL_RATES.SMMLV * CURRENT_LEGAL_RATES.IBC_MAXIMO;
  return Math.min(Math.max(ibc, minimumIbc), maximumIbc);
}

export function validateCalculatorInput(input: CalculatorInput): string[] {
  const errors: string[] = [];

  if (input.startDate > input.endDate) {
    errors.push('La fecha de inicio no puede ser posterior a la fecha final.');
  }

  const minimumSalary =
    input.contractType === 'MEDIO_TIEMPO'
      ? CURRENT_LEGAL_RATES.SMMLV * CURRENT_LEGAL_RATES.IBC_MINIMO_MEDIO_TIEMPO
      : CURRENT_LEGAL_RATES.SMMLV;

  if (input.role === 'EMPLEADO_DEPENDIENTE' && input.baseSalary < minimumSalary) {
    errors.push(`El salario no puede ser menor a ${minimumSalary.toLocaleString('es-CO')}.`);
  }

  if (input.role === 'CONTRATISTA_INDEPENDIENTE' && !input.grossIncome) {
    errors.push('Los ingresos brutos son obligatorios para contratistas.');
  }

  if (input.role === 'CONTRATISTA_INDEPENDIENTE' && (input.grossIncome ?? 0) < CURRENT_LEGAL_RATES.SMMLV) {
    errors.push('Para este simulador el contratista debe reportar ingresos iguales o superiores a 1 SMMLV.');
  }

  return errors;
}
