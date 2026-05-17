import { CURRENT_LEGAL_RATES } from '../constants/colombiaRates';
import { calculateTransportAllowance } from '../validators/laboralRules';
import type { BenefitsResult, CalculatorInput } from '../types/calculator.types';

const roundCurrency = (value: number) => Math.round(value);

export function calculateBenefits(input: CalculatorInput, workingDays: number): BenefitsResult | null {
  if (input.role === 'CONTRATISTA_INDEPENDIENTE') {
    return {
      prima: 0,
      cesantias: 0,
      interesesCesantias: 0,
      vacaciones: 0,
      baseWithAllowance: 0,
      baseWithoutAllowance: 0,
    };
  }

  const transportAllowance = calculateTransportAllowance(
    input.baseSalary,
    input.includesTransportAllowance,
  );
  const baseWithAllowance = input.baseSalary + transportAllowance;
  const dayRatio = workingDays / 360;
  const cesantias = baseWithAllowance * dayRatio;

  return {
    prima: roundCurrency(baseWithAllowance * dayRatio),
    cesantias: roundCurrency(cesantias),
    interesesCesantias: roundCurrency(
      cesantias * CURRENT_LEGAL_RATES.INT_CESANTIAS * (workingDays / 360),
    ),
    vacaciones: roundCurrency(input.baseSalary * CURRENT_LEGAL_RATES.VACACIONES * (workingDays / 30)),
    baseWithAllowance: roundCurrency(baseWithAllowance),
    baseWithoutAllowance: roundCurrency(input.baseSalary),
  };
}
