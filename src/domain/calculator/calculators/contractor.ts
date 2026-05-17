import { CURRENT_LEGAL_RATES } from '../constants/colombiaRates';
import { clampIbc } from '../validators/laboralRules';
import type { CalculatorInput } from '../types/calculator.types';

export function calculateContractorIbc(input: Pick<CalculatorInput, 'grossIncome'>, periodRatio: number): number {
  const grossIncome = input.grossIncome ?? 0;
  const baseIbc = grossIncome * CURRENT_LEGAL_RATES.IBC_INDEPENDIENTE_PORCENTAJE * periodRatio;
  return Math.round(clampIbc(baseIbc, CURRENT_LEGAL_RATES.SMMLV * periodRatio));
}
